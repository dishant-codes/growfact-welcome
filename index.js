let name = document.getElementById('name');
let phone = document.getElementById('phone');
let submit = document.getElementById('submit');
submit.addEventListener('click',()=>{
    let credentialUser = Math.ceil(Math.random()*10000);
    let str = "TSStudetn2020"+credentialUser.toString();
    generetPdf(name.value,str);
    name.value = '';
})


const inputImg = document.getElementById('imgInput')
const img = document.getElementById('img')

let photoUrl;

function getImg(event){

     const file = event.target.files[0]; // 0 = get the first file

     // console.log(file);

     let url = window.URL.createObjectURL(file);

     // console.log(url)

//      img.src = url;

     photoUrl = url;

}

inputImg?.addEventListener('change', getImg)



const generetPdf = async (name,cr)=>{
    const {PDFDocument,rgb} = PDFLib;

    const exBytes = await fetch("./Certificate.pdf").then((res)=>{
        return res.arrayBuffer()
    });

    const exFont = await fetch('./Bricolage_Grotesque/static/BricolageGrotesque_36pt-Bold.ttf').then((res)=>{
        return res.arrayBuffer();
    });
    


    
    const pdfDoc = await PDFDocument.load(exBytes)
    
    pdfDoc.registerFontkit(fontkit);
    const myFont = await pdfDoc.embedFont(exFont);
    

    const pages = pdfDoc.getPages();
    const firstP = pages[0];

    const { width: pageWidth } = firstP.getSize(); //
   
   
     // Fetch JPEG image
    const jpgUrl = photoUrl;
    const jpgImageBytes = await fetch(jpgUrl).then((res) => res.arrayBuffer());
        
    const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
    const jpgDims = jpgImage.scale(0.25);
   

  
  // Get the width and height of the first page
  const { width, height } = firstP.getSize();



    // Logic to adjust font size based on name length
    let nameFontSize = 25; // Default font size
    const maxFontSize = 25;
    const minFontSize = 15;
    const maxLength = 20; // Length at which font starts scaling down

    if (name.length > maxLength) {
        nameFontSize = Math.max(minFontSize, maxFontSize - (name.length - maxLength));
    }

    // Measure the width of the text at the adjusted font size
    const textWidth = myFont.widthOfTextAtSize(name, nameFontSize);

    // Calculate the x position to center the text
    const nameX = (pageWidth - textWidth) / 2;

  
  
    firstP.drawImage(jpgImage, {
      x: 165,
      y: 205,
      width: 155,
      height: 165,
    });
   
    firstP.drawText(name,{
        x:nameX,
        y:170,
        size:25,
        font:myFont,
        color: rgb(1, 1, 1)
    })

    firstP.drawText(phone.value,{
        x: 30,
        y: 30,
        size:14,
        font:myFont,
        color: rgb(0, 0, 0)
    })

    firstP.drawText(cr,{
        x:600,
        y:45,
        size:15,
        font:myFont,
        color: rgb(0, 0.76, 0.8)
    })


    const uri = await pdfDoc.saveAsBase64({dataUri: true});
    saveAs(uri,name+".pdf",{autoBom:true})
    // document.querySelector("#myPDF").src = uri;
};
