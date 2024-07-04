import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faCheck,
  faTimes,
  faAngleDown,
  faAngleUp,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import "./App.css";

const App = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [openUserId, setOpenUserId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      fetch("/celebrities.json")
        .then((response) => response.json())
        .then((data) => {
          setUsers(data);
          localStorage.setItem("users", JSON.stringify(data));
        })
        .catch((error) =>
          console.error("Error fetching the JSON file:", error)
        );
    }
  }, []);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditValues({
      age: calculateAge(user.dob),
      gender: user.gender,
      country: user.country,
      description: user.description,
    });
  };

  const handleDeleteClick = (userId) => {
    if (window.confirm("Are you sure you want to delete?")) {
      const updatedUsers = users.filter((user) => user.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    }
  };

  const handleSaveClick = (userId) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, ...editValues } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setEditingUserId(null);
  };

  const handleCancelClick = () => {
    setEditingUserId(null);
    setEditValues({});
  };

  const filteredUsers = users.filter((user) =>
    `${user.first} ${user.last}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`app container ${darkMode ? "dark-mode" : ""}`}>
      <div className="d-flex justify-content-between align-items-center my-4">
        <h1>FactWise Assessment Visual Reference</h1>
        <div>
          <button
            className={`btn btn-${darkMode ? "light" : "dark"} mr-2`}
            onClick={toggleDarkMode}
          >
            {darkMode ? (
              <>
                <FontAwesomeIcon icon={faSun} /> Light Mode
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faMoon} /> Dark Mode
              </>
            )}
          </button>
        </div>
      </div>
      <input
        type="text"
        className={`form-control mb-4 ${darkMode ? "dark-mode-input" : ""}`}
        placeholder="Search user"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="user-list list-group">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className={`user-item list-group-item ${
              openUserId === user.id ? "open" : ""
            }`}
          >
            <div
              className="user-header d-flex justify-content-between align-items-center"
              onClick={() =>
                setOpenUserId(openUserId === user.id ? null : user.id)
              }
            >
              <img
                src={user.picture}
                alt={`${user.first} ${user.last}`}
                className="rounded-circle"
              />
              <div className="user-name flex-grow-1 ml-3">
                {user.first} {user.last}
              </div>
              <FontAwesomeIcon
                icon={openUserId === user.id ? faAngleUp : faAngleDown}
              />
            </div>
            {openUserId === user.id && (
              <div className="user-details mt-3">
                {editingUserId === user.id ? (
                  <div className="edit-state">
                    <div className="form-group">
                      <label>Age:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={calculateAge(user.dob)}
                        readOnly
                      />
                    </div>
                    <div className="form-group">
                      <label>Gender:</label>
                      <select
                        className="form-control"
                        value={editValues.gender}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            gender: e.target.value,
                          })
                        }
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="transgender">Transgender</option>
                        <option value="rather not say">Rather not say</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Country:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editValues.country}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            country: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Description:</label>
                      <textarea
                        className="form-control"
                        value={editValues.description}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="d-flex justify-content-end mt-3">
                      <button
                        className="btn btn-success mr-2"
                        onClick={() => handleSaveClick(user.id)}
                        disabled={
                          editValues.gender === user.gender &&
                          editValues.country === user.country &&
                          editValues.description === user.description
                        }
                      >
                        <FontAwesomeIcon icon={faCheck} /> Save
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={handleCancelClick}
                      >
                        <FontAwesomeIcon icon={faTimes} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="view-state">
                    <div className="mb-2">
                      <strong>Age:</strong> {calculateAge(user.dob)}
                    </div>
                    <div className="mb-2">
                      <strong>Gender:</strong> {user.gender}
                    </div>
                    <div className="mb-2">
                      <strong>Country:</strong> {user.country}
                    </div>
                    <div className="mb-2">
                      <strong>Description:</strong> {user.description}
                    </div>
                    <div className="d-flex justify-content-end">
                      {calculateAge(user.dob) >= 18 && (
                        <button
                          className="btn btn-primary mr-2"
                          onClick={() => handleEditClick(user)}
                        >
                          <FontAwesomeIcon icon={faEdit} /> Edit
                        </button>
                      )}
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteClick(user.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
