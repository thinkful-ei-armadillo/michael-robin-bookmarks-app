/* global, store, index */
// event  handlers



//handle add boomark

//handle delete bookmark

// handle edit bookmark

// handle minimun star search




const bookmarkList = (function () {
  $.fn.extend({
    serializeJson: function () {
      const formData = new FormData(this[0]);
      const o = {};
      formData.forEach((val, name) => o[name] = val);
      return JSON.stringify(o);
    }
  });

  const generateForms = function () {
    return `
      <div class="${store.expanded ? 'hidden' : 'view'}"> 
      <button class="js-addbookmark-togglebutton">Add Bookmark</button><br>
        <label for="bookmark-filter">Filter Rating</label>
        <select id="bookmark-filter">
        <option value="null">none</option>
         <option>1</option>
         <option>2</option>
         <option>3</option>
         <option>4</option>
         <option>5</option>
        </select>
      </div>
      <div class="${store.expanded ? 'view' : 'hidden'}">
       <label for="bookmark-title">Title</label>
          <input type="text" id="bookmark-title" name="title" placeholder="Title"><br>
          <label for="bookmark-url">URL</label>
          <input type="text" id="bookmark-url" name="url" value="https://"><br>
          <label for="bookmark-description">Description</label>
          <input type="text" id="bookmark-description" name="desc" placeholder="Description"><br>
          <label for="bookmark-rating">Rating</label>
          <select id="bookmark-rating" name="rating">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
          </select><br>
          <button type="submit" name="submit" class="js-addBookmark-btn">Add Bookmark</button>
          <button class="js-addbookmark-togglebutton">Cancel</button>
        </div>`;
  }

  function generateBookmarkString(bookmarkedItems) {
    const items = bookmarkedItems.map((item) => generateItemElement(item));
    return items.join('');
  }

  function getItemIdFromElement(item) {
    return $(item)
      .data('item-id');
  }

  const generateEditTextBoxes = function (item) {
    return `
    <label for="bookmark-title">Title: </label>
    <input type="text" id="bookmark-title" name="title" value="${item.title}"><br>
    <label for="bookmark-description">Description: </label>
    <input type="text" id="bookmark-description" name="desc" value="${item.desc}">
    <label for="bookmark-url">URL: </label>
    <input type="text" id="bookmark-url" name="url" value="${item.url}">
    <label for="bookmark-rating">Rating: <label>
    <select id="bookmark-rating" name="rating">
     <option>1</option>
     <option>2</option>
     <option>3</option>
     <option>4</option>
     <option>5</option>
    </select><br>
    `
  }

  const generatebookmarkView = function (item) {
    return `
                  <h3>${item.title}</h3>
                    <div class="${item.expanded ? "view" : "hidden"}">
                      <p>description: ${(!item.desc) ? 'no description avaiable' : item.desc}</p> 
                      <a href="${item.url}">Visit Site</a><br>
                    </div>
                    <p>Rating: ${item.rating}</p>
                
    `
  }
  const generateItemElement = function (item) {
    return `
            <li class="js-bookmarked-item" data-item-id="${item.id}"> 
             ${item.isEditing ? generateEditTextBoxes(item) : generatebookmarkView(item)}
             <button class="${item.expanded ? "view" : "hidden"} js-edit-button">Edit</button>
             <button name="delete-button" id="js-bookmark-delete">Delete</button>
            </li>`
  }

  function render() {
    let items = [...store.items];

    if (store.filter > 0) {
      items = items.filter(el => el.rating >= store.filter);

    }
    console.log('`render` ran');
    $('.js-bookmark-form').html(generateForms());
    $('.js-bookmark-list').html(generateBookmarkString(items));
  }

  function handleDeleteButton() {
    $('.js-bookmark-list').on('click', "#js-bookmark-delete", function (ev) {
      const id = $(ev.currentTarget).parent('.js-bookmarked-item').data('item-id');
      api.deleteItem(id)
        .then(() => {
          store.findAndDelete(id);
          render();
        });

    })
  }

  function handleBookmarkSubmit() {
    $('.js-bookmark-form').submit('.js-addBookmark-btn', function (ev) {
      ev.preventDefault();
      const bookmarkitems = $(ev.target).serializeJson();
      console.log(bookmarkitems);
      api.createItem(bookmarkitems)
        .then(data => {
          store.addItem(data);
          render();
        });
    });
  }

  function handleBookMarkOpen() {
    $('.js-bookmark-list').on('click', 'h3', function (ev) {
      ev.preventDefault();
      const id = $(ev.currentTarget).parent('.js-bookmarked-item').data('item-id');
      store.toggleBookmark(id);
      render();
    })
  }

  function handleBookmarkToggle() {
    $('.js-bookmark-form').on('click', '.js-addbookmark-togglebutton', function (ev) {
      ev.preventDefault();
      store.expanded = !store.expanded;
      render();
    })
  }

  function bookmarkFilterResults() {
    $('.js-bookmark-form').on('change', '#bookmark-filter', function (ev) {
      const filterValue = $(ev.currentTarget).val();
      store.filter = filterValue;
      render();
    })
  }
  function handleEditingButton() {
    $('.js-bookmark-list').on('click', '.js-edit-button', function (ev) {
      const id = $(ev.currentTarget).parent('.js-bookmarked-item').data('item-id');
      console.log(id);
      store.setItemIsEditing(id, true);
      render();
    })
  }
  function bindEventListeners() {
    handleBookmarkToggle();
    handleBookmarkSubmit();
    handleBookMarkOpen();
    handleDeleteButton();
    bookmarkFilterResults();
    handleEditingButton();
  }

  return {
    render: render,
    bindEventListeners: bindEventListeners
  }
}());