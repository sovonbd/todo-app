import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../provider/AuthProvider";
import { RxUpdate } from "react-icons/rx";
import { RiDeleteBin6Line } from "react-icons/ri";

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import toast, { Toaster } from "react-hot-toast";
import { format, parse } from "date-fns";

const Todo = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [currentDate] = useState(new Date().toISOString().split("T")[0]);

  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { isLoading, refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axios.get(
        `https://todo-server-kappa-eight.vercel.app/tasks/${user?.email}`
      );
      setTasks(res.data);
      return res.data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (item) => {
      const res = await axios.post(
        "https://todo-server-kappa-eight.vercel.app/createTask",
        item
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data.insertedId) {
        toast.success("Successfully created a task!");
        refetch();
      }
    },
  });

  const onSubmit = async (data) => {
    const item = {
      taskName: data.name,
      taskDescription: data.description,
      taskDate: format(new Date(`${data.date}T00:00:00`), "MMM dd, yyyy", {
        timeZone: "America/Winnipeg",
      }),
      taskPriority: data.priority,
      userEmail: user.email,
      droppableId: "droppable-1",
    };

    mutate(item);

    reset();
    setShowModal(false);
  };

  const onUpdate = (data) => {
    const updatedItem = {
      taskName: data.name,
      taskDescription: data.description,
      taskDate: format(new Date(`${data.date}T00:00:00`), "MMM dd, yyyy", {
        timeZone: "America/Winnipeg",
      }),
      taskPriority: data.priority,
    };

    axios
      .patch(
        `https://todo-server-kappa-eight.vercel.app/tasks/${selectedTask._id}`,
        updatedItem
      )
      .then((res) => {
        // console.log(res.data);
        if (res.data.modifiedCount > 0) {
          toast.success("Successfully updated!");
        }
        refetch();
      });

    reset();
    setShowModal(false);
  };

  const handleUpdate = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    // console.log(id);
    axios
      .delete(`https://todo-server-kappa-eight.vercel.app/${id}`)
      .then((res) => {
        // console.log(res.data);
        if (res.data.deletedCount > 0) {
          toast("Task Deleted!", {
            icon: "😢",
          });
        }
        refetch();
      });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-dots loading-lg text-[#F36527] text-xl"></span>
      </div>
    );
  }

  const onDragEnd = async (result) => {
    const { destination } = result;

    if (!destination) {
      return;
    }

    const draggedTask = tasks.find((task) => task._id === result.draggableId);

    const updatedTasks = tasks.filter(
      (task) => task._id !== result.draggableId
    );

    if (destination.droppableId === "droppable-1") {
      draggedTask.droppableId = "droppable-1";
      updatedTasks.splice(destination.index, 0, draggedTask);
    } else if (destination.droppableId === "droppable-2") {
      draggedTask.droppableId = "droppable-2";
      updatedTasks.splice(destination.index, 0, draggedTask);
    } else if (destination.droppableId === "droppable-3") {
      draggedTask.droppableId = "droppable-3";
      updatedTasks.splice(destination.index, 0, draggedTask);
    }

    try {
      await axios.patch(
        `https://todo-server-kappa-eight.vercel.app/tasks/${draggedTask._id}`,
        {
          droppableId: draggedTask.droppableId,
        }
      );

      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating task droppableId:", error);
    }
    refetch();
  };

  return (
    <div className="my-5 space-y-5">
      <div className="text-center">
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-circle w-max bg-[#F36527] px-8 md:text-lg text-white normal-case border-[#F36527] hover:text-inherit hover:bg-transparent hover:border-[#F36527] hover:border-2 mt-4">
          Create A Task
        </button>
        {showModal && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 overflow-y-auto">
            <div className="modal-backdrop fixed inset-0 bg-black opacity-50"></div>
            <div className="modal-content p-6 bg-white rounded-lg shadow-lg z-50 w-[90%] md:max-w-md h-[90vh] lg:h-auto overflow-y-auto">
              <h3 className="font-bold text-lg mb-4">
                {selectedTask ? "Update Task" : "Create a new task"}
              </h3>
              <form
                onSubmit={handleSubmit(selectedTask ? onUpdate : onSubmit)}
                className="space-y-4">
                <label className="block">
                  <span className="text-gray-700 flex">Task Name</span>
                  <input
                    name="name"
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full mt-1"
                    {...register("name", { required: true })}
                    defaultValue={selectedTask ? selectedTask.taskName : ""}
                  />
                </label>

                <label className="">
                  <span className="text-gray-700 flex mt-4">Task Deadline</span>
                  <input
                    name="date"
                    type="date"
                    className="input input-bordered w-full mt-1"
                    {...register("date", { required: true })}
                    defaultValue={
                      selectedTask
                        ? format(
                            parse(
                              selectedTask.taskDate,
                              "MMM dd, yyyy",
                              new Date()
                            ),
                            "yyyy-MM-dd"
                          )
                        : ""
                    }
                    min={currentDate}
                  />
                </label>
                <label className="">
                  <span className="text-gray-700 flex mt-4">Task Priority</span>
                  <select
                    name="priority"
                    type="text"
                    className="input input-bordered w-full mt-1"
                    {...register("priority", { required: true })}
                    defaultValue={
                      selectedTask ? selectedTask.taskPriority : ""
                    }>
                    <option>Low</option>
                    <option>Moderate</option>
                    <option>High</option>
                  </select>
                </label>
                <label className="">
                  <span className="text-gray-700 flex mt-4">
                    Task Description
                  </span>
                  <textarea
                    name="description"
                    type="text"
                    placeholder="Type your description"
                    className="input input-bordered w-full mt-1"
                    style={{ height: "100px" }}
                    {...register("description", { required: true })}
                    defaultValue={
                      selectedTask ? selectedTask.taskDescription : ""
                    }
                  />
                </label>
                <button
                  type="submit"
                  className="btn bg-[#F36527] px-8 md:text-lg text-white normal-case border-[#F36527] hover:text-inherit hover:bg-transparent hover:border-[#F36527] hover:border-2 mt-4">
                  {selectedTask ? "Update" : "Create"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <h3 className="text-center font-semibold text-xl">To-Do Task</h3>
        <div className="overflow-x-auto">
          <Droppable droppableId="droppable-1">
            {(provided) => (
              <table
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="table bg-cyan-50/30 rounded-none">
                <thead>
                  <tr className="text-center text-sm font-bold text-black border-b-gray-300">
                    <th>Task Name</th>
                    <th>Description</th>
                    <th>Deadline</th>
                    <th>Priority</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {tasks
                    ?.filter((task) => task.droppableId === "droppable-1")
                    .map((task, idx) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={idx}>
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`text-center text-black hover:bg-cyan-50 ${
                              Date.parse(task.taskDate) <
                              Date.now() + 2 * 24 * 60 * 60 * 1000
                                ? "bg-red-100/70 hover:bg-red-100"
                                : ""
                            }`}>
                            <td>{task.taskName}</td>
                            <td>{task.taskDescription}</td>
                            <td>{task.taskDate}</td>
                            <td>{task.taskPriority}</td>
                            <td>
                              <div className="space-x-3 flex flex-row items-center justify-center">
                                <button
                                  onClick={() => handleUpdate(task)}
                                  className="tooltip"
                                  data-tip="Update">
                                  <RxUpdate className="text-green-500 text-lg" />
                                </button>
                                <button
                                  className="tooltip"
                                  data-tip="Delete"
                                  onClick={() => handleDelete(task._id)}>
                                  <RiDeleteBin6Line className="text-red-500 text-lg" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </tbody>
              </table>
            )}
          </Droppable>
        </div>

        <h3 className="text-center font-semibold text-xl">Ongoing Task</h3>
        <div className="overflow-x-auto">
          <Droppable droppableId="droppable-2">
            {(provided) => (
              <table
                className="table bg-cyan-50/60 rounded-none"
                {...provided.droppableProps}
                ref={provided.innerRef}>
                <thead>
                  <tr className="text-center text-sm font-bold text-black border-b-gray-300">
                    <th>Task Name</th>
                    <th>Description</th>
                    <th>Deadline</th>
                    <th>Priority</th>
                    <th>Action</th>
                  </tr>
                </thead>
                {/* Table body */}
                <tbody>
                  {/* Map through ongoingTasks to create Draggable items */}
                  {tasks
                    ?.filter((task) => task.droppableId === "droppable-2")
                    .map((task, idx) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={idx}>
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`text-center text-black hover:bg-cyan-50 ${
                              Date.parse(task.taskDate) <
                              Date.now() + 2 * 24 * 60 * 60 * 1000
                                ? "bg-red-100/70 hover:bg-red-100"
                                : ""
                            }`}>
                            {/* Render task details */}
                            <td>{task.taskName}</td>
                            <td>{task.taskDescription}</td>
                            <td>{task.taskDate}</td>
                            <td>{task.taskPriority}</td>
                            {/* Action button */}
                            <td>
                              <div className="space-x-3 flex flex-row items-center justify-center">
                                <button
                                  onClick={() => handleUpdate(task)}
                                  className="tooltip"
                                  data-tip="Update">
                                  <RxUpdate className="text-green-500 text-lg" />
                                </button>
                                <button
                                  className="tooltip"
                                  data-tip="Delete"
                                  onClick={() => handleDelete(task._id)}>
                                  <RiDeleteBin6Line className="text-red-500 text-lg" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </tbody>
              </table>
            )}
          </Droppable>
        </div>

        <h3 className="text-center font-semibold text-xl">Completed Task</h3>
        <div className="overflow-x-auto">
          <Droppable droppableId="droppable-3">
            {(provided) => (
              <table
                className="table bg-cyan-50 rounded-none"
                {...provided.droppableProps}
                ref={provided.innerRef}>
                {/* Table structure */}
                <thead>
                  {/* Table header */}
                  <tr className="text-center text-black font-bold text-sm border-b-gray-400">
                    <th>Task Name</th>
                    <th>Description</th>
                    <th>Deadline</th>
                    <th>Priority</th>
                    <th>Action</th>
                  </tr>
                </thead>
                {/* Table body */}
                <tbody>
                  {/* Map through ongoingTasks to create Draggable items */}
                  {tasks
                    ?.filter((t) => t.droppableId === "droppable-3")
                    .map((task, idx) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={idx}>
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="text-center text-black hover:bg-cyan-100/90">
                            {/* Render task details */}
                            <td>{task.taskName}</td>
                            <td>{task.taskDescription}</td>
                            <td>{task.taskDate}</td>
                            <td>{task.taskPriority}</td>
                            {/* Action button */}
                            <td>
                              <div className="space-x-3 flex flex-row items-center justify-center">
                                <button
                                  onClick={() => handleUpdate(task)}
                                  className="tooltip"
                                  data-tip="Update">
                                  <RxUpdate className="text-green-500 text-lg" />
                                </button>
                                <button
                                  className="tooltip"
                                  data-tip="Delete"
                                  onClick={() => handleDelete(task._id)}>
                                  <RiDeleteBin6Line className="text-red-500 text-lg" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </tbody>
              </table>
            )}
          </Droppable>
        </div>
      </DragDropContext>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Todo;
