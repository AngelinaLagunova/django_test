// import fillStatusTable from './dds.js';

// const STATUS_COLUMNS = [
//     {
//         name: "Действия",
//         data: "id",
//         render: (data) => {
//             return `
//                 <div class="btn-group" role="group" aria-label="Basic example">
//                     <button type="button" class="btn btn-primary edit-button" data-id="${data}" title="Редактировать"><i class="bi bi-pencil-square"></i></button>
//                     <button type="button" class="btn btn-danger delete-button" data-id="${data}" title="Удалить"><i class="bi bi-trash"></i></button>
//                 </div>
//             `
//         }
//     },
//     {
//         name: "Название",
//         data: "name",
//     }
// ]


// window.onload = function() {
//     renderStatusTable()
// }


// function renderStatusTable() {
//     fetch('/api/status/')
//         .then(response => response.json())
//         .then(data => {
//             fillStatusTable(STATUS_COLUMNS, data, 'status-table');
//             // initTableControls('/api/status/', "addNewStatusButton", "status-name", editStatusModalElement);
//         })
//         .catch(error => {
//             console.error('There was a problem with the fetch operation:', error);
//         });
// }

