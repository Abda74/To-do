import React, { useState } from 'react';

/*
  Composant principal TodoForm
  Formulaire pour ajouter des tâche.
*/

const TodoForm = ({ newTodo }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        newTodo({ title, description });
        setTitle('');
        setDescription('');
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Titre"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <textarea
                    className="form-control"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
                Ajouter
            </button>
        </form>
    );
};

export default TodoForm;
