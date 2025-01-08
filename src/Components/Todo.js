import React, { useEffect, useState } from 'react';
import TodoForm from "./TodoForm";
import { v4 as uuidv4 } from 'uuid';
import { MdEditSquare, MdDelete } from 'react-icons/md';

const Todo = () => {
    const [todos, setTodos] = useState([]);
    const [warning, setWarning] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [filterCompleted, setFilterCompleted] = useState(false);

    // Charger les tâches depuis LocalStorage
    useEffect(() => {
        const savedTodos = localStorage.getItem("todos");
        if (savedTodos) {
            setTodos(JSON.parse(savedTodos));
        }
    }, []);

    // Sauvegarder les tâches dans LocalStorage à chaque changement
    const saveTodosToLocalStorage = (todos) => {
    localStorage.setItem("todos", JSON.stringify(todos))
    }


    const handleDelete = (id) => {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
        saveTodosToLocalStorage(updatedTodos);
    };

    const handleEdit = (todo) => {
        setEditId(todo.id);
        setEditTitle(todo.titre);
        setEditDescription(todo.todo);
    };

    const submitEdit = () => {
        const updatedTodos = todos.map((todo) =>
            todo.id === editId
                ? { ...todo, titre: editTitle, todo: editDescription }
                : todo
        );

        setTodos(updatedTodos);
        saveTodosToLocalStorage(updatedTodos); // Mettre à jour le localStorage

        setEditId(null);
    };

    const cancelEdit = () => {
        setEditId(null);
    };

    const toggleComplete = (id) => {
        const updatedTodos = todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );

        setTodos(updatedTodos);
        saveTodosToLocalStorage(updatedTodos); // Mettre à jour le localStorage
    };


    const myTodos = todos
        .filter(todo => filterCompleted ? todo.completed : true)
        .map((todo) => (
            <li
                className={`list-group-item d-block align-items-center ${todo.completed ? 'bg-success text-white' : ''}`}
                key={todo.id}>
                <div className="w-100 me-4 p-2">
                    {editId === todo.id ? (
                        <div className="d-flex flex-wrap w-100 ">
                            <input
                                className="form-control p-3 mb-1"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder="Modifier le titre"
                            />
                            <input
                                className="form-control p-3"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                placeholder="Modifier la description"
                            />
                        </div>
                    ) : (
                        <>
                            <h1 className="fs-3">{todo.titre}</h1>
                            <p>{todo.todo}</p>
                            <span className="date fst-italic">Date : {new Date(todo.date).toLocaleString()}</span>
                        </>
                    )}
                </div>
                <div className="d-flex gap-2">
                    {editId === todo.id ? (
                        <>
                            <button className="btn btn-success" onClick={submitEdit}>
                                Enregistrer
                            </button>
                            <button className="btn btn-secondary" onClick={cancelEdit}>
                                Annuler
                            </button>
                        </>
                    ) : (
                        <>
                            {todo.completed ? null : (  // Afficher le bouton "Éditer" uniquement si la tâche n'est pas complétée
                                <button className="btn btn-warning" onClick={() => handleEdit(todo)}>
                                    <MdEditSquare />
                                </button>
                            )}
                            <button
                                className="btn btn-danger"
                                onClick={() => handleDelete(todo.id)}
                            >
                                <MdDelete />
                            </button>
                            <div className="bg-success p-2 rounded-1">
                                <input
                                    className="btn btn-success"
                                    type="checkbox"
                                    checked={todo.completed || false}
                                    onChange={() => toggleComplete(todo.id)}
                                />
                            </div>
                        </>
                    )}
                </div>
            </li>
        ));

    const newTodo = ({ title, description }) => {
        if (title && description) {
            setWarning(false);
            setTodos([
                ...todos,
                {
                    id: uuidv4(),
                    titre: title,
                    todo: description,
                    date: Date.now(),
                    completed: false,
                },
            ]);

            const updateTodos = [...todos , {
                id: uuidv4(),
                titre: title,
                todo: description,
                date: Date.now(),
                completed: false,
            }]

            saveTodosToLocalStorage(updateTodos);

        } else {
            setWarning(true);
        }
    };

    const ErrorMessage = warning && <div className="alert alert-danger" role="alert">Veuillez ajouter une tâche</div>;

    return (
        <div>
            <h1 className="text-center my-4">Liste des Tâches</h1>
            {ErrorMessage}
            <div className="text-center alert alert-warning" role="alert">
                {
                    todos.length >= 1
                        ? `Vous avez ${todos.length} tâche${todos.length > 1 ? 's' : ''}`
                        : 'Vous n\'avez aucune tâche'
                }
            </div>
            <TodoForm newTodo={newTodo} />
            <div className="text-start mt-3">
                <button
                    className="btn btn-warning me-2"
                    onClick={() => setFilterCompleted(false)}
                    disabled={!filterCompleted}
                >
                    Tout
                </button>
                <button
                    className="btn btn-success"
                    onClick={() => setFilterCompleted(true)}
                    disabled={filterCompleted}
                >
                    Complétées
                </button>
            </div>
            <ul className="list-group mt-4 mb-4 gap-2">
                {myTodos}
            </ul>
        </div>
    );
};

export default Todo;
