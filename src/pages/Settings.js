import { useState } from 'react';

import styles from '../styles/settings.module.css';
import { useAuth } from '../hooks';
import { useToasts } from 'react-toast-notifications';
const Settings = () => {
  const auth = useAuth();
  const { addToast } = useToasts();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(auth.user?.name ? auth.user.name : '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingForm, setSavingForm] = useState(false);
  const clearForm = () => {
    setPassword('');
    setConfirmPassword('');
  };
  const updateProfile = async () => {
    console.log('clicked');
    setSavingForm(true);
    let error = false;
    if (!name || !password || !confirmPassword) {
      addToast('please fill the data', {
        appearance: 'error',
      });
      error = true;
    }
    if (password !== confirmPassword) {
      addToast('password doesnot match', {
        appearance: 'error',
      });
      error = true;
    }

    if (error) {
      setSavingForm(false);
    }
    const response = await auth.updateUser(
      auth.user._id,
      name,
      password,
      confirmPassword
    );
    if (response.success) {
      setEditMode(false);
      setSavingForm(false);
      clearForm();
      return addToast('User added success fully', {
        appearance: 'success',
      });
    } else {
      return addToast(response.message, {
        appearance: 'error',
      });
    }
    setSavingForm(false);
  };

  return (
    <div className={styles.settings}>
      <div className={styles.imgContainer}>
        <img
          src="https://image.flaticon.com/icons/svg/2154/2154651.svg"
          alt=""
        />
      </div>

      <div className={styles.field}>
        <div className={styles.fieldLabel}>Email</div>
        <div className={styles.fieldValue}>{auth.user?.email}</div>
      </div>

      <div className={styles.field}>
        <div className={styles.fieldLabel}>Name</div>
        {editMode ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <div className={styles.fieldValue}>{auth.user?.email}</div>
        )}
      </div>

      {editMode && (
        <>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>Password</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <div className={styles.fieldLabel}>Confirm Password</div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </>
      )}

      <div className={styles.btnGrp}>
        {editMode ? (
          <>
            <button
              className={`button ${styles.saveBtn}`}
              onClick={updateProfile}
              disabled={savingForm}
            >
              {savingForm ? 'Saving profile...' : 'Save profile'}
            </button>
            <button
              className={`button ${styles.editBtn}`}
              onClick={() => setEditMode(false)}
            >
              Go back
            </button>
          </>
        ) : (
          <button
            className={`button ${styles.editBtn}`}
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default Settings;
