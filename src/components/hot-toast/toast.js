import { Toaster } from 'react-hot-toast';

// const notify = () => toast.success('Here is your toast.');

export default function Toast() {
  return (
    <div>
      {/* <button onClick={notify}>Make me a toast</button> */}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
