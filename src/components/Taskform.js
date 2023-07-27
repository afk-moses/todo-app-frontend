const Taskform = ({createTask, name,handleInputChange,isediting,updatetask}) => {
  return (
    <form className="task-form" onSubmit={isediting? updatetask : createTask}>
        <input type="text" placeholder="enter a task" name="name" value={name} onChange={handleInputChange}/>
        <button type="submit">{isediting ? "Edit" : "ADD"}</button>
    </form>
  )
}

export default Taskform