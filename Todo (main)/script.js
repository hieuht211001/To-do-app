//SET UP BUTTON,...
const taskInput = document.querySelector(".task-input input");
const doingTasksNumb = document.querySelector(".doingTasks");
const filters = document.querySelectorAll(".filters span");
const clearAll = document.querySelector(".clear-btn");
const addbtn = document.querySelector(".add-btn");
const taskBox = document.querySelector(".task-box");

//set up variable
var editId;
var count;
var checkboxes2;
var checkboxes;
var nodelist;
var checkTask;
var newNodelist;
var taskInfo;
var doingnumber;
var isEditTask = false;
// save app to local storage (even though refresh still retains data)
var todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

// main function setup
function showTodo(filter) {
    var liTag = "";
    if(todos) {
        todos.forEach((todo, id) => {
            var completed = todo.status === "completed" ? "checked" : "";    //task status
            if(filter === todo.status || filter === "all") {
                // update task status when check box, // edit, delete and mark task function call with each task created
                liTag += `<li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                                <p class="${completed}">${todo.name}</p>
                            </label>
                            <div class="settings">
                                <i onclick='editTask(${id}, "${todo.name}")' class="bi bi-pen"></i> &nbsp
                                <i onclick='deleteTask(${id}, "${filter}")' class="bi  bi-trash3"></i> &nbsp
                                <i id="markId" onclick='markTask()' class="bi bi-bookmark"></i>
                            </div>
                        </li>`;
            }
        });
    }
    // user manual
    taskBox.innerHTML = liTag || `<span>Click Add or press Enter to create task</span>`;
    checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ?clearAll.classList.remove("active") : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
    // search for checked tasks -> create nodelist
    count=document.querySelectorAll("input[type ='checkbox']:checked");
    // find number of doing task = number of all tasks - number of checked tasks
    doingnumber= todos.length - count.length;
    // show number of doing task in .doingTasks class, when number of doing task is 0 -> change word to'no'
    // (auto-update X) please refresh page when a new task is checked -> new number of remaining tasks will be displayed
    doingTasksNumb.textContent = doingnumber === 0 ? "no" : doingnumber;
    // call the function to show date-moth-year in footer
    displayDate();
}
//active
showTodo("all");

// CHECK ALL TASKS FUNCTION
// select all things that have type of input is checkbox (they are tasks)
// But in order to create day-night mode toggle, I have to use checkbox (it's at the top - the first checkbox)
// --> error: when click check all task button, toggle is on too -> that not what we want
checkboxes2= document.querySelectorAll("input[type ='checkbox']");
// solution: remove the first checkbox from the checkboxes2 array -> we have an array of all tasks
checkboxes = removeNode(checkboxes2,0);
// create the function that remove 1 thing from a nodelist
function removeNode(NodeList, i){
    var newElementSet = {};
    var newElementSeti = 0;
    var NodeListi;
    for(NodeListi = 0; NodeListi < NodeList.length; NodeListi+=1){
        if(NodeListi !== i){
            newElementSet[newElementSeti] = {value: NodeList[NodeListi], enumerable: true};
            newElementSeti += 1;
        }
    }
    newElementSet["length"] = {value: newElementSeti};
    nodelist = document.createDocumentFragment().childNodes;
    newNodelist = Object.create(nodelist, newElementSet);
    newNodelist.__proto__ = newNodelist.__proto__.__proto__;
    return newNodelist;
}
// create check all task function
function checkAll(myCheckbox){
    // if checkbox is already checked -> keep it
    if (myCheckbox.checked === true){
        checkboxes.forEach(function(checkbox){
            checkbox.checked = true;
        });
    }
    else{
        checkboxes.forEach(function(checkbox){
            checkbox.checked = false;
        });
    }
}
// when click to the all checkbox button -> function will be called
// PLEASE REFRESH PAGE WHEN CREATE A NEW TASK -> ALL CHECKBOX BUTTON WILL BE ABLE


// DAY-NIGHT MODE FUNCTION
// call the day-night mode toggle
const chk = document.getElementById("chk");
// when click toggle, interface will be change to dark mode -> click again to change to day mode
chk.addEventListener("change", () => {
    document.body.classList.toggle("dark");
});


// SHOW DATE-MONTH-YEAR FUNCTION
// create date-month-year function
function displayDate() {
    var options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }; // set type of output (number or text)
    var today  = new Date();    // get data of date and time
    // set up display language and run
    document.getElementById("date").innerHTML = today.toLocaleDateString("en-US", options);
}


// UPDATE STATUS OF TASK FUNCTION (CHECKED OR NOT)
function updateStatus(selectedTask) {
    var taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked) {
        // checked move to completed filter
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        // uncheck move to doing filter
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "doing";
    }
    // save to local storage (even though refresh still retains data)
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

// EDIT CONTENT OF TASK FUNCTION (USER INPUT BAR TO EDIT)
function editTask(taskId, textName) { // determine id of task that we want to edit
    editId = taskId;
    isEditTask = true;
    // input value
    taskInput.value = textName;
    taskInput.focus();
    taskInput.classList.add("active");
}

// DELETE TASK FUNCTION
function deleteTask(deleteId, filter) { // determine id of task that we want to delete
    isEditTask = false;
    // use splice() function,  delete 1 thing from (id of task that we want to delete) location in todos
    todos.splice(deleteId, 1);
    // save to local storage (even though refresh still retains data)
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
}

// MARK TASK FUNCTION
function markTask(markId) { //determine id of task that we want to mark
    // get element of task by task id
    var x = document.getElementById("markId");
    if (x.style.color === ""){  // if task is normal task
        x.style.color = "red";  // change mark icon color to red
        x.className ="bi bi-bookmark-fill "; // and replace it by a filled icon
    } else { //and vice versa
        //change mark icon color to normal
        x.style.color = "";
        // and replace it by a normal icon
        x.className ="bi bi-bookmark";
    }
}

// CLEAR ALL BUTTON SET UP
clearAll.addEventListener("click", () => {  // when we click clear all button
    isEditTask = false;
    // splice all tasks from 0
    todos.splice(0, todos.length);
    // save to local storage (even though refresh still retains data)
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo();
});

// INPUT DATA BY PRESS ENTER KEY
taskInput.addEventListener("keyup", (e) => {
    // removes whitespace from both sides of input content
    var userTask = taskInput.value.trim();
    if(e.key === "Enter" && userTask) {
        if(!isEditTask) {
            if(!todos){
                todos = [];
            }
            // create new task with doing status
            taskInfo = {name: userTask, status: "doing"};
            // push task information
            todos.push(taskInfo);
        } else {
            // if task is already exist -> edit (not create)
            isEditTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        // save to local storage (even though refresh still retains data)
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    }
});

// INPUT DATA BY CLICK ADD BUTTON
addbtn.addEventListener("click", () => {
    // removes whitespace from both sides of input content
    var userTask = taskInput.value.trim();
    if (userTask != 0 ){    // if users write somethings in input bar
        addbtn.classList.add("active");
        if(!isEditTask) {
            if(!todos){
                todos = [];
            }
            // create new task with doing status
            taskInfo = {name: userTask, status: "doing"};
            // push task information
            todos.push(taskInfo);
        } else {
            // if task is already exist -> edit (not create)
            isEditTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        // save to local storage (even though refresh still retains data)
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    } else { // if users don't wwrite anything in inputbar (don't input -> just press enter or click add button)
        // lock add button
        addbtn.classList.remove("active");
        // show alert to user
        window.alert("Looks like you haven't written anything yet :( \nPlease write something and try again!");
    }
});
