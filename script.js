
const imageUpload = document.getElementById("imageUpload");
const resultDiv = document.getElementById("result");

let model;
let labels;

async function loadModel() {
  model = await tf.loadLayersModel("product-identifier-webapp/model.json");
  const response = await fetch("product-identifier-webapp/labels.json");
  labels = await response.json();
}

imageUpload.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file || !model) return;

  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  img.onload = async () => {
    const tensor = tf.browser.fromPixels(img)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .div(tf.scalar(255))
      .expandDims();

    const prediction = model.predict(tensor);
    const predIdx = prediction.argMax(1).dataSync()[0];
    const label = labels[predIdx];

    resultDiv.innerHTML = `<p><strong>${label.id}</strong><br>${label.name}</p>`;
  };
});

// 初始化
loadModel();
