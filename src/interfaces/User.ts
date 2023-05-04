interface User {
  id: string;
  full_name: string;
  email: string;
  password?: string;
  token?: string;
  role?: string;
}

interface UserIdWithToken {
  id: string;
  token: string;
}

interface UserTest {
  id?: string;
  full_name?: string;
  fullName?: string;
  email?: string;
  password?: string;
  token?: string;
}

export {User, UserIdWithToken, UserTest};
