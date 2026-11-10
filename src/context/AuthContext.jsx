// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc,
  collection,
  getDocs,
  addDoc,
  Timestamp
} from 'firebase/firestore';
import { auth, db } from "../services/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Generate next ID for different roles
  const generateNextId = async (collectionName, prefix) => {
    try {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      
      let maxNum = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        const primaryField = `${collectionName.slice(0, -1)}Id`;
        const val = data[primaryField] || data.customerId || data.supplierId || data.pharmacistId || data.adminId;
        if (val && typeof val === 'string' && val.startsWith(prefix)) {
          const num = parseInt(val.replace(prefix, ''), 10);
          if (!isNaN(num) && num > maxNum) maxNum = num;
        }
      });
      
      const nextNum = maxNum + 1;
      return `${prefix}${String(nextNum).padStart(3, '0')}`;
    } catch (error) {
      console.error(`Error generating ${collectionName} ID:`, error);
      return `${prefix}${String(Date.now()).slice(-3)}`;
    }
  };

  // Register new user
  const register = async (userData) => {
    const { role } = userData;

    try {
      if (role === 'customer') {
        const { fullName, email, password, phone } = userData;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const customerId = await generateNextId('users', 'C');

        const savedUserData = {
          customerId,
          userId:    user.uid,
          fullName,
          email,
          phone:     phone || '',
          role:      'customer',
          status:    'active',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        await setDoc(doc(db, 'users', user.uid), savedUserData);
        sessionStorage.setItem('userId',    user.uid);
        sessionStorage.setItem('userRole',  'customer');
        sessionStorage.setItem('userName',  fullName);
        sessionStorage.setItem('userEmail', email);
        setUserRole('customer');

        return {
          success: true,
          user: { uid: user.uid, email, role: 'customer', ...savedUserData },
        };

      } else if (role === 'supplier') {
        const {
          companyName, email, password, contactPerson, phone,
          businessRegNo, businessAddress, categories,
          bankName, accountNumber, accountHolderName,
        } = userData;

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const supplierId = await generateNextId('suppliers', 'S');

        const savedUserData = {
          supplierId,
          userId:            user.uid,
          name:              companyName,
          companyName:       companyName,
          fullName:          contactPerson || companyName,
          email,
          phone:             phone || '',
          contactPerson:     contactPerson || '',
          businessRegNo:     businessRegNo || '',
          businessAddress:   businessAddress || '',
          categories:        categories || [],
          bankName:          bankName || '',
          accountNumber:     accountNumber || '',
          accountHolderName: accountHolderName || '',
          rating:            5,
          status:            'active',
          role:              'supplier',
          createdAt:         Timestamp.now(),
          updatedAt:         Timestamp.now(),
        };

        await setDoc(doc(db, 'suppliers', user.uid), savedUserData);

        // Mirror to pendingRequests as approved so AccountRequests page reflects active accounts
        try {
          await addDoc(collection(db, 'pendingRequests'), {
            type:              'supplier',
            companyName,
            email,
            contactPerson:     contactPerson || '',
            phone:             phone || '',
            businessRegNo:     businessRegNo || '',
            businessAddress:   businessAddress || '',
            categories:        categories || [],
            bankName:          bankName || '',
            accountNumber:     accountNumber || '',
            accountHolderName: accountHolderName || '',
            status:            'approved',
            approvedAt:        Timestamp.now(),
            requestedAt:       Timestamp.now(),
          });
        } catch (e) {
          console.warn('Could not mirror supplier to pendingRequests:', e);
        }

        sessionStorage.setItem('userId',    user.uid);
        sessionStorage.setItem('userRole',  'supplier');
        sessionStorage.setItem('userName',  companyName);
        sessionStorage.setItem('userEmail', email);
        setUserRole('supplier');

        return {
          success: true,
          user: { uid: user.uid, email, role: 'supplier', ...savedUserData },
        };

      } else if (role === 'pharmacist') {
        const {
          fullName, email, password, phone,
          nicNumber, licenseNumber, licenseExpiry, specialization,
        } = userData;

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const pharmacistId = await generateNextId('pharmacists', 'P');

        const savedUserData = {
          pharmacistId,
          userId:         user.uid,
          name:           fullName,
          fullName:       fullName,
          email,
          phone:          phone || '',
          nicNumber:      nicNumber || '',
          licenseNumber:  licenseNumber || '',
          licenseExpiry:  licenseExpiry || '',
          specialization: specialization || 'General Pharmacy',
          role:           'pharmacist',
          status:         'active',
          createdAt:      Timestamp.now(),
          updatedAt:      Timestamp.now(),
        };

        await setDoc(doc(db, 'pharmacists', user.uid), savedUserData);

        // Mirror to pendingRequests as approved so AccountRequests page reflects active accounts
        try {
          await addDoc(collection(db, 'pendingRequests'), {
            type:           'pharmacist',
            fullName,
            email,
            phone:          phone || '',
            nicNumber:      nicNumber || '',
            licenseNumber:  licenseNumber || '',
            licenseExpiry:  licenseExpiry || '',
            specialization: specialization || 'General Pharmacy',
            status:         'approved',
            approvedAt:     Timestamp.now(),
            requestedAt:    Timestamp.now(),
          });
        } catch (e) {
          console.warn('Could not mirror pharmacist to pendingRequests:', e);
        }

        sessionStorage.setItem('userId',    user.uid);
        sessionStorage.setItem('userRole',  'pharmacist');
        sessionStorage.setItem('userName',  fullName);
        sessionStorage.setItem('userEmail', email);
        setUserRole('pharmacist');

        return {
          success: true,
          user: { uid: user.uid, email, role: 'pharmacist', ...savedUserData },
        };

      } else if (role === 'admin') {
        const { fullName, email, password, phone } = userData;

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const adminId = await generateNextId('admins', 'A');

        const savedUserData = {
          adminId,
          userId:    user.uid,
          name:      fullName,
          fullName:  fullName,
          email,
          phone:     phone || '',
          role:      'admin',
          status:    'active',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        await setDoc(doc(db, 'admins', user.uid), savedUserData);

        sessionStorage.setItem('userId',    user.uid);
        sessionStorage.setItem('userRole',  'admin');
        sessionStorage.setItem('userName',  fullName);
        sessionStorage.setItem('userEmail', email);
        setUserRole('admin');

        return {
          success: true,
          user: { uid: user.uid, email, role: 'admin', ...savedUserData },
        };
      }

    } catch (error) {
      console.error('Registration error:', error);
      let message = 'Registration failed';
      if (error.code === 'auth/email-already-in-use') message = 'Email already registered';
      else if (error.code === 'auth/weak-password')   message = 'Password too weak';
      else if (error.code === 'auth/invalid-email')   message = 'Invalid email address';
      throw new Error(message);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let userData = null;
      let actualRole = null;

      const roleCollections = {
        'supplier': 'suppliers',
        'customer': 'users',
        'pharmacist': 'pharmacists',
        'admin': 'admins'
      };

      for (const [role, collectionName] of Object.entries(roleCollections)) {
        const userDoc = await getDoc(doc(db, collectionName, user.uid));
        if (userDoc.exists()) {
          userData = userDoc.data();
          actualRole = userData.role;
          break;
        }
      }

      if (!userData) {
        await signOut(auth);
        throw new Error('User profile not found. Please contact administrator.');
      }

      const collectionName = roleCollections[actualRole];
      await setDoc(doc(db, collectionName, user.uid), {
        ...userData,
        lastLogin: Timestamp.now()
      }, { merge: true });

      sessionStorage.setItem('userId', user.uid);
      sessionStorage.setItem('userRole', actualRole);
      sessionStorage.setItem('userName', userData.fullName || userData.name);
      sessionStorage.setItem('userEmail', userData.email);

      setUserRole(actualRole);

      console.log(` User logged in as ${actualRole} in this tab`);

      return { 
        success: true, 
        user: {
          uid: user.uid,
          email: user.email,
          role: actualRole,
          ...userData
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      
      let message = 'Login failed';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = 'Invalid email or password';
      } else if (error.code === 'auth/invalid-credential') {
        message = 'Invalid email or password';
      } else if (error.message.includes('not found')) {
        message = error.message;
      }
      
      throw new Error(message);
    }
  };
    // Login with Google
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      let userData = null;
      let actualRole = null;

      const roleCollections = {
        'supplier': 'suppliers',
        'customer': 'users',
        'pharmacist': 'pharmacists',
        'admin': 'admins',
      };

      // 1. Check if user already exists in any collection
      for (const [, collectionName] of Object.entries(roleCollections)) {
        const userDoc = await getDoc(doc(db, collectionName, user.uid));
        if (userDoc.exists()) {
          userData = userDoc.data();
          actualRole = userData.role;
          break;
        }
      }

      // 2. If user doesn't exist, create as Customer by default
      if (!userData) {
        const snapshot = await getDocs(collection(db, 'users'));
        let maxNum = 0;
        snapshot.forEach(d => {
          const data = d.data();
          if (data.customerId) {
            const num = parseInt(data.customerId.replace('C', ''));
            if (num > maxNum) maxNum = num;
          }
        });
        const customerId = `C${String(maxNum + 1).padStart(3, '0')}`;

        actualRole = 'customer';
        userData = {
          customerId,
          userId: user.uid,
          fullName: user.displayName || 'New Customer',
          email: user.email,
          phone: user.phoneNumber || '',
          role: 'customer',
          status: 'active',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };
        await setDoc(doc(db, 'users', user.uid), userData);
      }

      // 3. Check account is active
      if (userData.status && userData.status !== 'active') {
        await signOut(auth);
        throw new Error('Your account is suspended. Please contact the administrator.');
      }

      // 4. Setup session
      sessionStorage.setItem('userId', user.uid);
      sessionStorage.setItem('userRole', actualRole);
      sessionStorage.setItem('userName', userData.fullName || userData.name);
      sessionStorage.setItem('userEmail', userData.email);
      setUserRole(actualRole);

      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          role: actualRole,
          ...userData,
        },
      };
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  // Reset password — sends a Firebase password reset email
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error.code, error.message);
      throw error; // re-throw so callers can read error.code
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await signOut(auth);
      sessionStorage.clear();
      setUser(null);
      setCurrentUser(null);
      setUserRole(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    }
  };

  // Get current user's full data
  const getCurrentUserData = async () => {
    if (!currentUser) return null;

    try {
      const role = sessionStorage.getItem('userRole');
      let collectionName;
      
      switch(role) {
        case 'supplier': collectionName = 'suppliers'; break;
        case 'customer': collectionName = 'users'; break;
        case 'pharmacist': collectionName = 'pharmacists'; break;
        case 'admin': collectionName = 'admins'; break;
        default: return null;
      }

      const userDoc = await getDoc(doc(db, collectionName, currentUser.uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  // Get supplier profile for current user
  const getSupplierProfile = async () => {
    if (!currentUser || userRole !== 'supplier') return null;

    try {
      const supplierDoc = await getDoc(doc(db, 'suppliers', currentUser.uid));
      if (supplierDoc.exists()) {
        return { id: supplierDoc.id, ...supplierDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching supplier profile:', error);
      return null;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setCurrentUser(currentUser);
        
        const storedRole = sessionStorage.getItem('userRole');
        
        if (storedRole) {
          setUserRole(storedRole);
          setLoading(false);
          return;
        }
        
        try {
          let userDoc = await getDoc(doc(db, 'suppliers', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role);
            sessionStorage.setItem('userId', currentUser.uid);
            sessionStorage.setItem('userRole', userData.role);
            sessionStorage.setItem('userName', userData.name);
            sessionStorage.setItem('userEmail', userData.email);
            setLoading(false);
            return;
          }

          userDoc = await getDoc(doc(db, 'pharmacists', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role);
            sessionStorage.setItem('userId', currentUser.uid);
            sessionStorage.setItem('userRole', userData.role);
            sessionStorage.setItem('userName', userData.name);
            sessionStorage.setItem('userEmail', userData.email);
            setLoading(false);
            return;
          }

          userDoc = await getDoc(doc(db, 'admins', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role);
            sessionStorage.setItem('userId', currentUser.uid);
            sessionStorage.setItem('userRole', userData.role);
            sessionStorage.setItem('userName', userData.fullName);
            sessionStorage.setItem('userEmail', userData.email);
            setLoading(false);
            return;
          }

          userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role);
            sessionStorage.setItem('userId', currentUser.uid);
            sessionStorage.setItem('userRole', userData.role);
            sessionStorage.setItem('userName', userData.fullName);
            sessionStorage.setItem('userEmail', userData.email);
            setLoading(false);
            return;
          }

          console.error('User data not found in any collection');
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      } else {
        setUser(null);
        setCurrentUser(null);
        setUserRole(null);
        sessionStorage.clear();
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    currentUser,
    userRole,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    getCurrentUserData,
    getSupplierProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}