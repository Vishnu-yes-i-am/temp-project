// Select all required elements
const dropArea = document.querySelector(".uploadText"),
dragText = dropArea.querySelector(".changeHeader"),
button = dropArea.querySelector(".chooseBtn"),
input = dropArea.querySelector("input");
// img= document.querySelector(".img");
let file;   
button.onclick = () => {
    input.click();
}

input.addEventListener("change", function(){
    file = this.files[0];
    dropArea.classList.add("active");
    console.log(file);
    // showFile();
})


dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropArea.classList.add("active");
    dragText.textContent = "Release to Upload File"
})


dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File"
})

dropArea.addEventListener("drop", (event) => {
    event.preventDefault();
    file = event.dataTransfer.files[0];
    console.log(file);
    // showFile();
})



// function showFile(){
//     let fileType = file.type;
//     let validExtensions = ["image/jpeg", "image/jpg", "image/png"];
//     if(validExtensions.includes(fileType)) {
//         let fileReader = new FileReader();
//         fileReader.addEventListener("load", function () {
//             let fileURL = fileReader.result;
//             console.log(fileURL);
//             img.src = fileURL;
//           }, false);
//         fileReader.onload = () => {
           
//         }
//         fileReader.readAsDataURL(file);
//     }else {
//         alert("This is not an image file");
//         dropArea.classList.remove("active");
//         dragText.textContent = "Drag & Drop to Upload File";
//     }
// }