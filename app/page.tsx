"use client";

import { useCallback, useEffect, useState } from "react";

type Todo = {
  id: string;
  todo: string;
  isCompleted: boolean;
  createdAt: string;
};

export default function Home() {
  const [value, setValue] = useState("");
  const [renderList, setRenderList] = useState<Todo[]>([]);
  const [filteredList, setFilteredList] = useState<Todo[]>([]);
  const [warning, setWarning] = useState("");
  const [isHover, setIsHover] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null); 

  const filterTodos = useCallback((query: string) => {
    if (query === "") {
      setFilteredList(renderList);
    } else {
      const filtered = renderList.filter((item) =>
        item.todo.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredList(filtered);
    }
  }, [renderList]);

  const updateTodo = async (id: string, todo: string) => {
    try {
      const response = await fetch(`/api/todo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todo }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  
  const handleClick = async () => {
    if (value === "") {
      return;
    }

    if (editId) {
      const updatedTodo = await updateTodo(editId, value)
      if(updatedTodo){
        const updatedList = renderList.map((item) =>
          item.id === editId ? { ...item, todo: value } : item
        );
        setRenderList(updatedList);
        setFilteredList(updatedList);
        setEditId(null);
        setWarning("");
      }else{
        return ('error submiting update')
      }
      
    } else {
      const isDuplicate = renderList.some(
        (item) => item.todo.toLowerCase() === value.toLowerCase()
      );
      if (isDuplicate) {
        setWarning("Todo item already exists!");
      } else {
        const newTodo = {
          id: String(renderList.length + 1), 
          todo: value,
          isCompleted: false,
          createdAt: new Date().toISOString(),
        };

        const response = await fetch('/api/todo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTodo)})
          const result = await response.json();
          console.log(result);          
          if (result.success) {
            const updatedList = [...renderList, result.todo];
            setRenderList(updatedList);
            setFilteredList(updatedList);
            setWarning(""); 
            console.log('ok it work');
          } else {
            setWarning("Failed to add todo.");
          }
      }
    }
    setValue("");
  };

  const handleRemove = async (id: string) => {
    try {
        const response = await fetch(`/api/todo/${id}`, {
            method: 'DELETE',
        });
        
        const result = await response.json();
        if (result.success) {
            const updatedList = renderList.filter((item) => item.id !== id);
            setRenderList(updatedList);
            setFilteredList(updatedList);
        } else {
            console.error("Failed to remove todo.");
        }
    } catch (error) {
        console.error("Error deleting todo:", error);
    }
};

  const handleEdit = (id: string, todo: string) => {
    setEditId(id);
    setValue(todo);
  };

  const toggleComplete = (id: string) => {
    const updatedList = renderList.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setRenderList(updatedList);
    setFilteredList(updatedList);
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch("/api/todo");
        let todos: Todo[] = await response.json();
        todos = todos.filter(
          (todo) =>
            todo.todo !== "" && todo.id && typeof todo.isCompleted === "boolean"
        );
        setRenderList(todos);
        setFilteredList(todos);
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      }
    };
    fetchTodos();
  }, []);

  useEffect(() => {
    filterTodos(value);
  }, [value, filterTodos]);
  
  return (
    <>
      <div className="w-6/12 m-auto">
        <h1 className="text-lime-400 text-3xl text-center">Todo-List</h1>

        <div className="flex justify-center">
          <input
            className="py-2 px-3 text-black outline-none"
            placeholder="Enter todo-list"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
            onKeyDown={(e) => e.key === "Enter" && handleClick()}
          />
          <button className="bg-blue-500 py-2 px-3" onClick={handleClick}>
            {editId ? "Edit List" : "Add List"}
          </button>
        </div>

        {warning && (
          <div className="text-red-500 mt-2 text-center">{warning}</div>
        )}

        <div className="flex justify-center">
          {filteredList.length === 0 && value !== "" ? (
            <div className="text-red-500 mt-2 text-center">
              No result. Create a new one instead!
            </div>
          ) : (
            <ol className="list-decimal">
              {filteredList.map((item) => (
                <li
                  key={item.id}
                  className="list-item"
                  onMouseEnter={() => setIsHover(item.id)}
                  onMouseLeave={() => setIsHover(null)}
                  style={{
                    textDecoration: item.isCompleted ? "line-through" : "none",
                  }}
                >
                  {item.todo}
                  {isHover === item.id && (
                    <>
                      <button
                        className="bg-red-500 text-white py-1 px-2 rounded ml-4"
                        onClick={() => handleRemove(item.id)}
                      >
                        Remove
                      </button>
                      <button
                        className="bg-yellow-500 text-white py-1 px-2 rounded ml-2"
                        onClick={() => handleEdit(item.id, item.todo)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-green-500 text-white py-1 px-2 rounded ml-2"
                        onClick={() => toggleComplete(item.id)}
                      >
                        {item.isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </>
  );
}
