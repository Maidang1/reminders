import './App.css';
import { sendNotification } from '@tauri-apps/plugin-notification';
import { useRegisterNotification } from './hooks/notification';

function App() {
  useRegisterNotification();
  return (
    <div className='flex'>
      <button
        onClick={() => {
          console.log('send notification');
          sendNotification({
            title: 'hello',
            body: 'this is a notification',
          });
        }}
      >
        send notification
      </button>
    </div>
  );
}

export default App;
