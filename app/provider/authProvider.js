'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const AuthContext = createContext();

export function AuthProvider({ children }) { 

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    checkAuthStatus();
  }, []);

   const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/v1/user/me');
      const data = await response.json();

      if (data.success) {
        setUser({
          id: data.user.userId,
          username: data.user.username,
          role:data.user.role
        });

      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
   };
  
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();



      if (data.success) {
        setUser({
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          role: data.user.role
        });


        return { success: true, message: data.message };
      } else {
        setError(data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
      return { success: false, message: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, password, email) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.json();

      if (data.success) {
        setUser({
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          role: data.user.role
        });



        return { success: true, message: data.message };
      } else {
        setError(data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please try again.');
      return { success: false, message: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "Do you really want to log out?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, log out!'
      });

      if (result.isConfirmed) {
        await fetch('/api/v1/user/logout', {
          method: 'POST',
        });
        setUser(null);

        Swal.fire({
          title: 'Logged out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 1500,
          timerProgressBar: true
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Error logging out. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };


  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !! user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}