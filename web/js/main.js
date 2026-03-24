//DOM取得
const upload = document.getElementById("upload");
const format = document.getElementById("format");
const convertBtn = document.getElementById("convert");
const downloadBtn = document.getElementById("download");

//クリックイベント
convertBtn.addEventListener('click', () => {
    const file = upload.files[0];
    if (!file) return alert("画像を選択して下さい");

    convertImage(file, format.value);
});

//
function convertImage(file, type) {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const url = canvas.toDataURL(type);
        const originalName = file.name;
        const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
        const ext = type.split("/")[1];
        downloadBtn.download = nameWithoutExt + "." + ext;

        downloadBtn.href = url;
        downloadBtn.style.display = "inline-block";
        convertBtn.style.display = "none";
    }
}