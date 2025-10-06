
import "./AdminPage.css";

const AdminPage = () => {
  return (
    <div className="admin-page">
      <h1 className="admin-title">Admin Panel - Coming Soon!</h1>

      <div className="admin-illustration">
        🛠️
      </div>

      <div className="admin-content">
        <p>
          This feature is under development. Soon, admins will be able to manage the platform efficiently.
        </p>

        <h3>Planned Admin Features:</h3>
        <ul>
          <li>Create new quizzes</li>
          <li>Update existing quizzes</li>
          <li>Delete quizzes</li>
          <li>View user activity and results</li>
          <li>Manage challenges and participants</li>
        </ul>

        <p>Stay tuned! 🎉</p>
      </div>
    </div>
  );
};

export default AdminPage;
