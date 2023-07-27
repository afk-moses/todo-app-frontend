import Taskform from "./Taskform"
import Task from "./Task"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import {URL} from "../App"
import loadingImg from "../assets/loader.gif"
const TaskList = () => {
  const [tasks,settasks] = useState([]);
  const [completedTasks, setcompletedTasks] = useState([]);
  const [isLoading, setisloading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    completed: false
  })
  const [isediting,setisediting] = useState(false);
  const [taskID,settaskID] = useState("");
  const {name} = formData
  useEffect(() => {
    const ctask = tasks.filter((task) => {
        return task.completed === true
    })
    setcompletedTasks(ctask);
  }, [tasks])
  
  const handleInputChange = (e) => {
    const { name, value} = e.target;
    setFormData({...formData,[name]: value});
  }
  const settocomplete = async(task) => {
    const newformdata = {
        name: task.name,
        completed: true
    }
    try{
        await axios.put(`${URL}/api/task/${task._id}`,newformdata);
        getTasks()
    }catch(error){
        toast.error(error.message)
    }
  }
  const getTasks = async() =>{
    setisloading(true);
    try{
        const {data} = await axios.get(`${URL}/api/task`);
        settasks(data);
        setisloading(false);
    }catch(error){
        toast.error(error.message);
        console.log(error);
        setisloading(false);
    }
  }

  useEffect(() => {
    getTasks()
  },[])

  const createTask = async (e) => {
    e.preventDefault();
    if(name === ""){
        return toast.error("input field cannot be empty");
    }
    try{
        await axios.post(`${URL}/api/task`,formData);
        toast.success("Task Added Successfully");
        getTasks();
    }catch(error){
        toast.error(error.message);
    }
  }

  const deleteTask = async(id) => {
    try {
        await axios.delete(`${URL}/api/task/${id}`)
        getTasks();
    }catch(error) {
        toast.error(error.message); 
    }
  }

  const getsingletask = async (task) =>{
    setFormData({name: task.name,completed: false});
    settaskID(task._id); 
    setisediting(true);
  } 

    const updatetask = async (e) => {
        e.preventDefault();
        if(name === ""){
            return toast.error("input field cannot be empty");
        }
        try{
            await axios.put(`${URL}/api/task/${taskID}`,formData);
            setFormData({...formData, name:""})
            setisediting(false);
            getTasks()
        }catch(error){
            toast.error(error.message);
        }
    }
  return (
    <div>
        <h2>Task Manager</h2>
        <Taskform name={name} handleInputChange={handleInputChange} createTask={createTask} isediting={isediting} updatetask={updatetask}/>
        <div className="--flex-between --pb">
            <p>
                <b>Total Tasks:</b> {tasks.length}
            </p>
            <p>
                <b>Completed Tasks:</b> {completedTasks.length}
            </p>
        </div>
        <hr></hr>
        {
            isLoading && (
                <div className="--flex-center">
                    <img src={loadingImg} alt="loading"/>
                </div>
            )
        }
        {
            !isLoading && tasks.length === 0? (
                <p>no tasks added</p>
            ) : (
                <>
                {tasks.map((task,index) => {
                    return(
                        <Task key={task._id} task = {task} index={index} deleteTask={deleteTask} getsingletask={getsingletask} settocomplete={settocomplete}/>
                    )
                })}
                </>
            )
        }

    </div>
  )
}

export default TaskList