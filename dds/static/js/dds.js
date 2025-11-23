const COLUMNS = [
    {
        name: "Действия",
        data: "id",
        render: (data) => {
            return `
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button type="button" class="btn btn-primary edit-button" data-id="${data}" title="Редактировать"><i class="bi bi-pencil-square"></i></button>
                    <button type="button" class="btn btn-danger delete-button" data-id="${data}" title="Удалить"><i class="bi bi-trash"></i></button>
                </div>
            `
        }
    },
    {
        name: "Дата",
        data: "date_display",
    },
    {
        name: "Статус",
        data: "status_name",
    },
    {
        name: "Тип",
        data: "type_name",
    },
    {
        name: "Категория",
        data: "category_name",
    },
    {
        name: "Подкатегория",
        data: "subcategory_name",
    },
    {
        name: "Сумма",
        data: "amount",
    },
    {
        name: "Комментарии",
        data: "comment",
    }
]
let deleteModalElement = null
let deleteModal = null

let editModalElement = null
let editModal = null

document.addEventListener('DOMContentLoaded', function() {
    

window.onload = function() {
    initDeleteModal()
    initEditModal()
    renderTable()
    fillFilterSelector()
}

function initDeleteModal(){
    deleteModalElement = document.getElementById('confirmDeleteModal');
    deleteModal = new bootstrap.Modal(deleteModalElement);
    const confirmDeleteButton = document.getElementById("confirmDeleteButton")
    confirmDeleteButton.addEventListener('click', function(){
        const id = deleteModalElement.getAttribute('data-id')
        fetch(`api/record/${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "X-CSRFToken": csrftoken
            }
        })
        .then(() => {
            deleteModal.hide()
            deleteModalElement.setAttribute('data-id', "-1")
            renderTable()
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    })
}

function initEditModal(){
    editModalElement = document.getElementById('editModal');
    editModal = new bootstrap.Modal(editModalElement);

    const confirmSaveButton = document.getElementById("confirmSaveButton")
    confirmSaveButton.addEventListener('click', function(){
        const id = editModalElement.getAttribute('data-id')

        let dataToSend = {}
        dataToSend.date = document.getElementById("date").value || null
        dataToSend.comment = document.getElementById("comment").value
        dataToSend.amount = document.getElementById("amount").value || 0
        dataToSend.subcategory = document.getElementById("subcategory").value
        dataToSend.status = document.getElementById("status").value

        if (!dataToSend.status){
            document.getElementById("status").classList.add("is-invalid")
            return
        }

        if (!dataToSend.subcategory){
            document.getElementById("subcategory").classList.add("is-invalid")
            return
        }
        let promise = null
        if (id == -1){
            promise = fetch(`api/record/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken
                },
                body: JSON.stringify(dataToSend)
            })
        }
        else {
            promise = fetch(`api/record/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken
                },
                body: JSON.stringify(dataToSend)
            })
        }
        promise.then(() => {
            document.getElementById("status").classList.remove("is-invalid")
            document.getElementById("subcategory").classList.remove("is-invalid")
            editModal.hide();
            editModalElement.setAttribute('data-id', "-1")
            renderTable()
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    })

}

function setSelect(elId, data, includeDefault=true, defaultText='Выбрать..', nullText='Нет данных', emptyText='Нет данных'){
    let selectEl = document.getElementById(elId)
    selectEl.innerHTML=''
    if (data == null || data.length === 0){
        const option = document.createElement('option');
        option.value = '';
        if(data == null){
            option.textContent = nullText;
        }
        else {
            option.textContent = emptyText;
        }
        selectEl.appendChild(option);
        selectEl.setAttribute('disabled', 'disabled')
        return
    }

    selectEl.removeAttribute('disabled')
    if(includeDefault){
        const option = document.createElement('option');
        option.value = '';
        option.textContent = defaultText;
        selectEl.appendChild(option);
    }
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        selectEl.appendChild(option);
    });
}

function fillFilterSelector(type=null, category=null, inModal=false, updateAll=false) {
    let filterData = {}
    if (type){
        filterData.type = type
    }
    if (category){
        filterData.category = category
    }

    let selectorSuff = '-filter'

    if (inModal){
        selectorSuff = ''
    }

    const typeSelectEl = document.getElementById("type"+selectorSuff)
    typeSelectEl.addEventListener('change', function (){
        fillFilterSelector(typeSelectEl.value, null, inModal)
    })
    const categorySelectEl = document.getElementById("category"+selectorSuff)
    categorySelectEl.addEventListener('change', function (){
        fillFilterSelector(typeSelectEl.value, categorySelectEl.value, inModal)
    })

    return fetch('api/get-filter-choices/?' + new URLSearchParams(filterData))
        .then(response => {
            return response.json()
        })
        .then(data => {
            if (updateAll || !type){
                setSelect("type"+selectorSuff, data.types, true, 'Выберите тип')
                setSelect("status"+selectorSuff, data.statuses, true, 'Выберите статус')
            }
            if (updateAll || !category){
                setSelect(
                    "category"+selectorSuff,
                    data.categories,
                    true,
                    'Выберите категорию',
                    'Сначала нужно выбрать тип',
                    'Не найдено категорий для данного типа',
                )
            }

            setSelect(
                "subcategory"+selectorSuff,
                data.subcategories,
                true,
                'Выберите подкатегорию',
                'Сначала нужно выбрать категорию',
                'Не найдено подкатегорий для данной категории',
            )
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function getFilterData() {
    let filterData = {}

    const dateFrom = document.getElementById("dateFrom").value || null
    if (dateFrom){
        filterData.date_after = dateFrom
    }
    const dateTo = document.getElementById("dateTo").value || null
    if (dateTo){
        filterData.date_before = dateFrom
    }

    const status = document.getElementById("status-filter").value || null
    if (status){
        filterData.status = status
    }

    const type = document.getElementById("type-filter").value || null
    if (type){
        filterData.type = type
    }

    const category = document.getElementById("category-filter").value || null
    if (category){
        filterData.category = category
    }
    const subcategory = document.getElementById("subcategory-filter").value || null
    if (subcategory){
        filterData.subcategory = subcategory
    }

    return filterData
}

function renderTable() {
    const filterData = getFilterData()
    fetch('api/record/?' + new URLSearchParams(filterData))
        .then(response => {
            return response.json()
        })
        .then(data => {
            fillTable(COLUMNS, data, 'main-table')
            initTableControls()

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function initTableControls(){
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = button.getAttribute('data-id')
            deleteModalElement.setAttribute('data-id', id);
            deleteModal.show();
        });
    });

    const addNewButton = document.getElementById("addNewButton")
    addNewButton.addEventListener('click', function() {
        editModalElement.setAttribute('data-id', -1);
        document.getElementById("date").valueAsDate = new Date()
        document.getElementById("comment").value = ""
        document.getElementById("amount").value = 0
        fillFilterSelector(null, null,true, true)
        editModal.show();
    });

    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = button.getAttribute('data-id')
            editModalElement.setAttribute('data-id', id);

            fetch('api/record/' + id)
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    console.log(data)
                    document.getElementById("date").value = data.date
                    document.getElementById("comment").value = data.comment
                    document.getElementById("amount").value = data.amount
                    fillFilterSelector(data.type, data.category,true, true).then(() => {
                        document.getElementById("type").value = data.type
                        document.getElementById("category").value = data.category
                        document.getElementById("subcategory").value = data.subcategory
                        document.getElementById("status").value = data.status
                        editModal.show();
                    })
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        });
    });
}

 function fillTable(columns, data, tableName){
    let table = document.getElementById(tableName)
    table.innerHTML = '';
    let tableHead = document.createElement("thead")
    let headTr = document.createElement("tr")
    let tableBoby = document.createElement("tbody")
    columns.forEach(el => {
        let thEl = document.createElement("th")
        thEl.setAttribute("scope", "col")
        thEl.innerHTML = el.name
        headTr.appendChild(thEl);
    })
    tableHead.appendChild(headTr);

    data.forEach(dataItem => {
        let currTr = document.createElement("tr")
        columns.forEach(column => {
            let tdEl = document.createElement("td")
            if (column.render){
                tdEl.innerHTML = column.render(dataItem[column.data])
            }
            else {
                tdEl.innerHTML = dataItem[column.data]
            }
            currTr.appendChild(tdEl);
        })
        tableBoby.appendChild(currTr);
    })

    table.appendChild(tableHead);
    table.appendChild(tableBoby);

}

});