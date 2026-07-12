

export const Profile = () => {

  // TODO: Replace demo data with real selected user details when backend wiring is ready
  const demoSelectedUser = {
    name: "Demo User",
    email: "demo.user@example.com",
    id: "demo-user-001",
  };

  const user = demoSelectedUser;

  return (
    <div className="">
      <h4 className="text-xl font-bold mb-4 text-center">Profile</h4>
      <div className="space-y-2">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>ID:</strong> {user.id}
        </p>
      </div>
    </div>
  );
};
