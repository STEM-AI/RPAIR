// import Swal from 'sweetalert2';

// const Alert = {
//   confirm: ({
//     title = 'Are you sure?',
//     html = 'This action cannot be undone!',
//     confirmText = 'Confirm',
//     cancelText = 'Cancel',
//     onConfirm,
//     onCancel
//   }) => {
//     Swal.fire({
//       title,
//       html,
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonColor: '#4f4',
//       cancelButtonColor: '#d33',
//       confirmButtonText: confirmText,
//       cancelButtonText: cancelText,
//       customClass: {
//         popup: 'rounded-xl',
//         confirmButton: '!bg-green-600 hover:!bg-green-700 !text-white !px-4 !py-2 !rounded-lg',
//         cancelButton: '!bg-red-600 hover:!bg-red-700 !text-white !px-4 !py-2 !rounded-lg'
//       }
//     }).then((result) => {
//       if (result.isConfirmed && onConfirm) {
//         onConfirm();
//       } else if (onCancel) {
//         onCancel();
//       }
//     });
//   },

//   success: ({ title = 'Success!', text = '' }) => {
//     Swal.fire({
//       title,
//       text,
//       icon: 'success',
//       confirmButtonColor: '#4f4',
//       customClass: {
//         confirmButton: '!bg-green-600 hover:!bg-green-700 !text-white !px-4 !py-2 !rounded-lg'
//       }
//     });
//   }
// };

// export default Alert;



import Swal from 'sweetalert2';

const Alert = {
  confirm: ({ 
    title = 'Are you sure?',
    html = 'This action cannot be undone!',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel
  }) => {
    Swal.fire({
      title,
      html,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f4',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      customClass: {
        popup: 'rounded-xl',
        confirmButton: '!bg-green-600 hover:!bg-green-700 !text-white !px-4 !py-2 !rounded-lg',
        cancelButton: '!bg-red-600 hover:!bg-red-700 !text-white !px-4 !py-2 !rounded-lg'
      }
    }).then((result) => {
      if (result.isConfirmed && onConfirm) {
        onConfirm();
      } else if (onCancel) {
        onCancel();
      }
    });
  },

  success: ({ title = 'Success!', text = '' }) => {
    Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonColor: '#4f4',
      customClass: {
        confirmButton: '!bg-green-600 hover:!bg-green-700 !text-white !px-4 !py-2 !rounded-lg'
      }
    });
  },

  error: ({ title = 'Error!', text = '' }) => {
    Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonColor: '#d33',
      customClass: {
        confirmButton: '!bg-red-600 hover:!bg-red-700 !text-white !px-4 !py-2 !rounded-lg'
      }
    });
  },

  warning: ({ 
    title = 'Warning!', 
    text = '', 
    confirmText = 'OK', 
    cancelText = 'Cancel',
    onConfirm,
    onCancel 
  }) => {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: !!onCancel,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      customClass: {
        popup: 'rounded-xl',
        confirmButton: '!bg-blue-600 hover:!bg-blue-700 !text-white !px-4 !py-2 !rounded-lg',
        cancelButton: '!bg-red-600 hover:!bg-red-700 !text-white !px-4 !py-2 !rounded-lg'
      }
    }).then((result) => {
      if (result.isConfirmed && onConfirm) {
        onConfirm();
      } else if (onCancel) {
        onCancel();
      }
    });
  }
};

export default Alert;