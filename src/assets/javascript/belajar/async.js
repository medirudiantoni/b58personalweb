// console.log(1)
// setTimeout(() => {
//     console.log(2)
// }, 1000);
// console.log(3);

// callback function
// function consoleLog2(consoleLog3){
//     setTimeout(() => {
//         console.log(2)
//         consoleLog3();
//     }, 1000);
// }

// console.log(1);
// consoleLog2(() => console.log(3));

// console.log(fetch)


// const nikah = true;

// const janjiNikahin = new Promise((resolve, reject) => {

//     if(nikah){
//         resolve("Saya nikahi");
//     } else {
//         reject("Saya tunda nikah")
//     }
// });

// janjiNikahin
//     .then(res => console.log(res))
//     .catch(error => console.log(error))


// console.log(1)
// setTimeout(() => {
//     console.log(2)
// }, 1000);
// console.log(3)
// hasil: 1, 3, 2
// gimana biar hasilnya tetapi 1, 2, 3
// dengan membuat promise yang jika 2 belum tampil maka 3 tidak akan tampil


// console.log(1)

const tungguDulu = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // console.log(2);
            resolve(2); // setelah 2 muncul, maka baru jalankan kode selanjutnya dengan diwakili oleh relove()
        }, 1000);
    })
}

// tungguDulu().then(() => console.log(3))

// async function happy(){
//     const res = await tungguDulu().then((n) => n);
//     if(res){
//         console.log(res);
//         console.log(3)
//     }
// };

// console.log(1)
// happy()


// const prin = () => {
//     return new Promise((res, rej) => {
//         setTimeout(() => {
//             res(2)
//         }, 1000);
//     })
// };

// async function exeprin(){
//     const res = await prin().then(res => res);
//     if(res){
//         console.log(res);
//         console.log(3)
//     }
// }

// console.log(1)
// exeprin()


const janjiBayarHutang = (bayarHutang) => {
    return new Promise((resolve, reject) => {
        if(bayarHutang){
            resolve('Hutang dibayar')
        } else {
            reject('gagal bayar hutang')
        }
    })
};

const huhang = async () => {
    const hutang = await janjiBayarHutang(true).then(msg => msg);
    if(hutang){
        console.log(hutang)
    }
}

huhang()