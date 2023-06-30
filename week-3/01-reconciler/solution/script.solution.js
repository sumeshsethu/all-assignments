
function createDomElements(data) {
  var parentElement = document.getElementById("mainArea");

  // Get the current children of the parent element and convert it to an array
  var currentChildren = Array.from(parentElement.children);

  for (var x in data) {

    // Check if we already have an item by comparing id

    var childPresent = currentChildren.find(item => item.children[0].innerHTML === String(data[x].id));

    if (childPresent) {
      // If it exists, update it
      childPresent.children[1].innerHTML = data[x].title;
      childPresent.children[2].innerHTML = data[x].description;

      // Remove this updated child from the currentChildren array
      currentChildren = currentChildren.filter(item => item !== childPresent);
    }
    else {
      // This is a new child
      var childElement = document.createElement("div");

      var grandChildElement0 = document.createElement("span");
      grandChildElement0.innerHTML = data[x].id;

      var grandChildElement1 = document.createElement("span");
      grandChildElement1.innerHTML = data[x].title;

      var grandChildElement2 = document.createElement("span");
      grandChildElement2.innerHTML = data[x].description;

      var grandChildElement3 = document.createElement("button");
      grandChildElement3.innerHTML = "Delete";
      grandChildElement3.setAttribute("onclick", "deleteTodo(" + data[x].id + ")")

      childElement.appendChild(grandChildElement0)
      childElement.appendChild(grandChildElement1)
      childElement.appendChild(grandChildElement2)
      childElement.appendChild(grandChildElement3)
      parentElement.appendChild(childElement);
    }
  }

  // Remove all remaining childrens from currentChildren becuase they are no longer present.
  currentChildren.forEach(item => parentElement.removeChild(item));
}

// Code that creates a dynamic list of todos every 5 seconds
window.setInterval(() => {
  let todos = [];
  for (let i = 0; i < Math.floor(Math.random() * 10); i++) {
    todos.push({
      id: Math.ceil(Math.random() * 10),
      title: "Go shopping",
      description: "Buy milk"
    })
  }

  createDomElements(todos)
}, 5000)