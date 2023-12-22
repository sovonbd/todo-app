import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../provider/AuthProvider";
import Swal from "sweetalert2";
import { GrUpdate } from "react-icons/gr";

const Todo = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

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
        Swal.fire({
          icon: "success",
          title: "Success...",
          text: "Successfully created the task",
        });
      }
    },
  });

  const {
    data: tasks,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axios.get(
        `https://todo-server-kappa-eight.vercel.app/tasks/${user?.email}`
      );
      return res.data;
    },
  });

  // const { mutate: updateTask } = useMutation({
  //   mutationFn: async (id, item) => {
  //     const res = await axios.patch(`https://todo-server-kappa-eight.vercel.app/tasks/${id}`, item);
  //     console.log(res.data);
  //     return res.data;
  //   },
  //   onSuccess: (data) => {
  //     if (data.insertedId) {
  //       Swal.fire({
  //         icon: "success",
  //         title: "Success...",
  //         text: "Successfully created the task",
  //       });
  //     }
  //   },
  // });

  const onSubmit = (data) => {
    const item = {
      taskName: data.name,
      taskDescription: data.description,
      taskDate: data.date,
      taskPriority: data.priority,
      userEmail: user.email,
    };

    mutate(item);

    reset();
    setShowModal(false);
    refetch();
  };

  const onUpdate = (data) => {
    const updatedItem = {
      taskName: data.name,
      taskDescription: data.description,
      taskDate: data.date,
      taskPriority: data.priority,
    };

    axios
      .patch(
        `https://todo-server-kappa-eight.vercel.app/tasks/${selectedTask._id}`,
        updatedItem
      )
      .then((res) => {
        console.log(res.data);
        if (res.data.modifiedCount > 0) {
          Swal.fire({
            icon: "success",
            title: "Success...",
            text: "Successfully updated the task",
          });
        }
        refetch();
      });

    // console.log(selectedTask._id, updatedItem);

    // updateTask(selectedTask._id, updatedItem);

    reset();
    setShowModal(false);
  };

  const handleUpdate = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-dots loading-lg text-[#F36527] text-xl"></span>
      </div>
    );
  }

  return (
    <div className="my-5 space-y-5">
      <div className="text-center">
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-circle w-max bg-[#F36527] px-8 md:text-lg text-white normal-case border-[#F36527] hover:text-inherit hover:bg-transparent hover:border-[#F36527] hover:border-2 mt-4">
          Create A Task
        </button>
        {showModal && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 overflow-auto">
            <div className="modal-backdrop fixed inset-0 bg-black opacity-50"></div>
            <div className="modal-content p-6 bg-white rounded-lg shadow-lg z-50 w-full md:max-w-md">
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
                  <span className="text-gray-700 flex mt-4">
                    Task Description
                  </span>
                  <input
                    name="description"
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full mt-1"
                    {...register("description", { required: true })}
                    defaultValue={
                      selectedTask ? selectedTask.taskDescription : ""
                    }
                  />
                </label>
                <label className="">
                  <span className="text-gray-700 flex mt-4">Task Deadline</span>
                  <input
                    name="date"
                    type="date"
                    className="input input-bordered w-full mt-1"
                    {...register("date", { required: true })}
                    defaultValue={selectedTask ? selectedTask.taskDate : ""}
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
      <div>
        <h3 className="text-center font-semibold text-xl">To-Do Task</h3>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr className="text-center">
                <th>Task Name</th>
                <th>Description</th>
                <th>Deadline</th>
                <th>Priority</th>
                <th>Action</th>
              </tr>
            </thead>
            {tasks.map((task) => (
              <tbody key={task._id}>
                <tr className="hover text-center">
                  <td>{task.taskName}</td>
                  <td>{task.taskDescription}</td>
                  <td>{task.taskDate}</td>
                  <td>{task.taskPriority}</td>
                  <td className="px-2 space-x-4">
                    <div className="tooltip" data-tip="Update">
                      <button onClick={() => handleUpdate(task)}>
                        <GrUpdate></GrUpdate>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-center font-semibold text-xl">Ongoing Task</h3>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr className="text-center">
                <th>Task Name</th>
                <th>Description</th>
                <th>Deadline</th>
                <th>Priority</th>
                <th>Action</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-center font-semibold text-xl">Completed Task</h3>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr className="text-center">
                <th>Task Name</th>
                <th>Description</th>
                <th>Deadline</th>
                <th>Priority</th>
                <th>Action</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Todo;
