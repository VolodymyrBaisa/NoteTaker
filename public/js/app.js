//Variables
const saveAPI = "/api/save";
const updateAPI = "/api/update";
const notesAPI = "/api/notes";
const removeAPI = "/api/remove";
const foundAPI = "/api/found";
let id = "";
//Selectors
const startButtonEl = $("#buttonStart");
const backButtonEl = $("#backButton");
const clearButtonEl = $("#clearButton");
const saveButtonEl = $("#saveButton");
const newButtonEl = $("#newButton");
const allNoteContainerEl = $("#allNoteContainer");
//Note Content
const noteTitleEl = $("#noteTitle");
const noteContentEl = $("#noteContent");
//Alert
const alertContainerEl = $(".alert_container");
const cancelButtonEl = $("#cancelButton");
//Events
startButtonEl.click(onClickStartButton);
backButtonEl.click(onClickBackButton);
cancelButtonEl.click(onClickCancelButton);
clearButtonEl.click(onClickClearButton);
newButtonEl.click(onClickNewButton);
saveButtonEl.click(onClickSaveButton);
noteTitleEl.on("keypress", onChangeNoteTitle);
//Functions
function onClickStartButton() {
    redirect("/notes");
}

function onClickBackButton() {
    redirect("/");
}

function onClickClearButton() {
    clearNoteValues();
}

function onClickShowNote(e) {
    const parent = $(e.target).parent();
    const index = parent.data("index");
    id = index;
    $.ajax({
        url: foundAPI + "/" + index,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: (data) => {
            data = data[0];
            if (data) {
                noteTitleEl.val(data.header);
                noteContentEl.val(data.note);
            }
        },
        error: (xhr, status, error) => console.error(xhr.responseText),
    });
}
//Alert
function onClickRemoveButton(e) {
    alertContainerEl.addClass("active");
    const element = $(e.target);
    alertContainerEl
        .find("#removeButton")
        .click({ root: element.parent() }, onClickAgreeToRemoveButton);
}

function onClickAgreeToRemoveButton(e) {
    const parent = e.data.root;
    const index = parent.data("index");

    $.ajax({
        url: removeAPI,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            id: index,
        }),
        dataType: "json",
        success: () => {
            parent.remove();
            alertContainerEl.removeClass("active");
        },
        error: (xhr, status, error) => console.error(xhr.responseText),
    });
}

function onClickCancelButton() {
    alertContainerEl.removeClass("active");
}

function onClickSaveButton(e) {
    const header = noteTitleEl.val();
    const note = noteContentEl.val();
    //Validation
    if (!header) {
        validate(noteTitleEl);
        return;
    }
    //Send POST
    if (!id) {
        $.ajax({
            url: saveAPI,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                header,
                note,
            }),
            dataType: "json",
            error: (xhr, status, error) => console.error(xhr.responseText),
        });
        //Clear Note Values
        clearNoteValues();
    } else {
        $.ajax({
            url: updateAPI,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                id,
                header,
                note,
            }),
            dataType: "json",
            error: (xhr, status, error) => console.error(xhr.responseText),
        });
    }
    //Render Notes
    renderAllNotes();
}

function onClickNewButton() {
    id = "";
    clearNoteValues();
}

function onChangeNoteTitle() {
    if (noteTitleEl.val()) {
        validate(noteTitleEl);
    }
}
//Init
(() => {
    renderAllNotes();
})();

function renderAllNotes() {
    $.ajax({
        url: notesAPI,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: (data) => {
            templateAllNotesSelector(JSON.parse(data));
        },
        error: (xhr, status, error) => console.error(xhr.responseText),
    });
}

function renderFoundNotes(id) {
    $.ajax({
        url: notesAPI,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: (data) => {
            templateAllNotesSelector(JSON.parse(data));
        },
        error: (xhr, status, error) => console.error(xhr.responseText),
    });
}

function redirect(location) {
    window.location.href = window.location.origin + location;
}

function validate(el) {
    if (!el.val()) {
        el.addClass("error");
    } else el.removeClass("error");
}

function templateAllNotesSelector(data) {
    allNoteContainerEl.empty();
    data.forEach(({ header, id }) => {
        const template = $(`
        <div data-index="${id}" class="note_container">
        <span class="title">${header}</span>
        <div class="remove_note_container">
            <!-- prettier-ignore -->
            <svg class="remove_note" preserveAspectRatio="none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 16H19V18H15V16ZM15 8H22V10H15V8ZM15 12H21V14H15V12ZM3 18C3 19.1 3.9 20 5 20H11C12.1 20 13 19.1 13 18V8H3V18ZM14 5H11L10 4H6L5 5H2V7H14V5Z" fill="#F4F4F4"/>         
            </svg>
            <!-- prettier-ignore -->
            <svg class="remove_note_hover" preserveAspectRatio="none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 16H19V18H15V16ZM15 8H22V10H15V8ZM15 12H21V14H15V12ZM3 18C3 19.1 3.9 20 5 20H11C12.1 20 13 19.1 13 18V8H3V18ZM14 3H11L10 2H6L5 3H2V5H14V3Z" fill="#F4F4F4"/>
                </svg>
        </div>
    </div>
        `);
        template.find(".remove_note_container").click(onClickRemoveButton);
        template.find(".title").click(onClickShowNote);
        allNoteContainerEl.append(template);
    });
}

function clearNoteValues() {
    noteTitleEl.val("");
    noteContentEl.val("");
}
