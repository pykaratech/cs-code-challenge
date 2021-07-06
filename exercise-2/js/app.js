const taskInput = document.getElementById("new-task");
const addButton = document.getElementsByTagName("button")[0];
const incompleteTasksHolder = document.getElementById("incomplete-tasks");
const completedTasksHolder = document.getElementById("completed-tasks");

//Custom auto increment id
let incId=0;

// default value
let currentItemList=[
                    {id:1,item_name:'Pay Bills',task_status:0,delete_status:0},
                    {id:2,item_name:'Go Shopping',task_status:0,delete_status:0},
                    {id:3,item_name:'See the Doctor',task_status:1,delete_status:0},
                    ];

// Get itemlist from Local storage
getLocatStorage = (storageName) => {
  return localStorage.getItem(storageName);
}

// Set item list array  object into local storage
setLocatStorage = (itemList) => {
  let myJSON = JSON.stringify(itemList);
  localStorage.setItem("itemlistStorage",myJSON);
  localStorage.setItem("storageflag",true);
}

createNewTaskElement  = (taskString,taskId,taskStatus) => {

  const listItem = document.createElement("li");
  const checkBox = document.createElement("input");
  const label = document.createElement("label");
  const editInput = document.createElement("input");
  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");

  listItem.id = "li_"+taskId;
  listItem.row_id = taskId;

  checkBox.type = "checkbox";
  checkBox.id = "checkbox_"+taskId;
  checkBox.checked=taskStatus;

  editInput.type = "text";
  editInput.id = "text_"+taskId;

  editButton.innerText = "Edit";
  editButton.className = "edit";

  deleteButton.innerText = "Delete";
  deleteButton.className = "delete";

  label.innerText = taskString;

  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);
  return listItem;
};

updateArray =(id,item_name,deleteStatus,taskStatus) => {
  currentItemList.filter((dataList)=> {
    if(dataList.id == id)
    {
      if(item_name && item_name!="")
      {
        dataList.item_name=item_name;
      }
      dataList.delete_status=deleteStatus;

      if(taskStatus && taskStatus!="")
      {
        dataList.task_status=(taskStatus=="TODO")?0:1;
      }
    }
  });
  setLocatStorage(currentItemList);
};

//Events starts

addTask = () => {
  taskInput.className = "";
  if(taskInput.value && taskInput.value!="")
  {
    incId++;
    const listItemName = taskInput.value; // || "New Item";
    const new_array = {id:incId,item_name:listItemName,task_status:0,delete_status:0};
    currentItemList.push(new_array);

    loopTaskElement(currentItemList);
    setLocatStorage(currentItemList);
    taskInput.value = "";
  }
  else
  {
    taskInput.focus();
    taskInput.className = "error";
  }
}

saveTask=(editInput,li_id)=>{
  const current_txtbox = document.getElementById("text_"+li_id);
  current_txtbox.className = "";

  if(editInput.value && editInput.value!="")
  {
    updateArray(li_id,editInput.value,0,"");
    const listItem=editInput.parentNode;
    const label = listItem.querySelector("label");
    const button = listItem.getElementsByTagName("button")[0];

    label.innerText = editInput.value;
    button.innerText = "Edit";
    listItem.classList.toggle("editMode");
  }
  else
  {
    current_txtbox.focus();
    current_txtbox.className = "error";
  }
}

editTask =({target}) => {
  let {parentNode} =target;

  const listItem=parentNode;
  const editInput = listItem.querySelectorAll("input[type=text")[0];
  const label = listItem.querySelector("label");
  const button = listItem.getElementsByTagName("button")[0];

  const containsClass = listItem.classList.contains("editMode");
  if (containsClass)
  {
   let li_id=listItem.row_id;
   saveTask(editInput,li_id);
  }
  else
  {
     editInput.value = label.innerText
     button.innerText = "Save";
     listItem.classList.toggle("editMode");
  }
};

deleteTask = ({target}) => {

  let {parentNode} =target;

  let listItem= parentNode;

  let ul = listItem.parentNode;
  ul.removeChild(listItem);

  let li_id=listItem.row_id;
  updateArray(li_id,"",1,"");
};

clickCheckBox =({target}) => {
  let {parentNode} = target;

  let listItem=parentNode;
  let li_id=listItem.row_id;
  let cb = document.getElementById('checkbox_'+li_id);
  let taskStatus=(cb.checked)?"COMPLETED":"TODO";
  updateArray(li_id,"",0,taskStatus);
  loopTaskElement(currentItemList);
};

keydown=({key})=> {
  taskInput.className = "";
  if(key=="Enter")
  {
    addTask();
  }
}

editInputKeydown=({target,key})=> {
  const li_id=target.parentNode.row_id;
  target.className = "";
  if(key=="Enter")
  {
    saveTask(target,li_id);
  }
}

bindTaskEvents = (taskListItem) => {

  const checkBox = taskListItem.querySelectorAll("input[type=checkbox]")[0];
  const editButton = taskListItem.querySelectorAll("button.edit")[0];
  const deleteButton = taskListItem.querySelectorAll("button.delete")[0];
  const editInput=taskListItem.querySelectorAll("input[type=text]")[0];

  editButton.onclick = editTask;
  deleteButton.onclick = deleteTask;
  editInput.addEventListener("keydown", editInputKeydown);
  checkBox.onchange = clickCheckBox;
};
//Events Ends

//Reset List
loopTaskElement  = (itemList) =>{
  incompleteTasksHolder.innerHTML="";
  completedTasksHolder.innerHTML="";

  for(let i=0;i<itemList.length;i++)
  {
    const loop_items=itemList[i];
    const item_name=loop_items.item_name;
    const taskStatus=loop_items.task_status;
    const taskId=loop_items.id;
    const deleteStatus=loop_items.delete_status;

    if(!deleteStatus)
    {
      const listItem = createNewTaskElement(item_name,taskId,taskStatus);
      if(taskStatus)
      {
        completedTasksHolder.appendChild(listItem);
      }
      else
      {
        incompleteTasksHolder.appendChild(listItem);
      }
      bindTaskEvents(listItem);
    }
    incId=taskId;
  }
};

loaderToggle=(status) => {
  const loader =  document.getElementById("loader");
  const container =  document.getElementById("container");
  loader.className = "d-none";
  container.className="container";
  if(status)
  {
    loader.className="";
    container.className="container d-none";
  }
};

//intialize the page with default values
initPage = () => {
  const storagelist = getLocatStorage("itemlistStorage");
  const storageflag = getLocatStorage("storageflag");
  if(storagelist && storagelist!="" && storageflag)
  {
    const itemList=JSON.parse(storagelist);
    currentItemList=itemList;
  }
  loopTaskElement(currentItemList);
  setTimeout(function()
  {
    loaderToggle(false);
  }, 500);

  addButton.addEventListener("click", addTask);
  taskInput.addEventListener("keydown", keydown);
};

// Load Application
initPage();
