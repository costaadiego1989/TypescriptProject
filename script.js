"use strict";
// function toNumber(value: number | string) {
//     if (typeof value === 'number') {
//         return value;
//     } else if (typeof value === 'string') {
//         return Number(value);
//     } else {
//         throw new Error('Erro personalizado');
//     }
// }
// console.log(toNumber('770'));
// async function fetchCursos() {
//     const response = await fetch('https://api.origamid.dev/json/cursos.json');
//     const data = await response.json();
//     console.log(data);
//     mostrarCursos(data);
//   }
//   fetchCursos();
//   interface Curso {
//     aulas: number;
//     gratuito: boolean;
//     horas: number;
//     idAulas: number[];
//     nivel: 'iniciante' | 'avancado';
//     nome: string;
//     tags: string[]
//   }
//   function mostrarCursos(cursos: Curso[]) {
//     cursos.forEach(curso => {
//         let cor;
//         if (curso.nivel === "avancado") {
//             cor = "blue";
//         } else {
//             cor = "red";
//         }
//         document.body.innerHTML +=
//         `
//             <div>
//                 <h2 style="color: ${cor}">${curso.nome}</h2>
//                 <h4>Aulas: ${curso.aulas}</h4>
//                 <p>Horas: ${curso.horas}</p>
//                 <p>ID Aulas: ${curso.idAulas.join(' | ')}</p>
//                 <p>Nivel: ${curso.nivel}</p>
//             </div>
//         `
//     })
//   }
// const link = document.getElementById('origamid');
// if (link instanceof HTMLAnchorElement) {
//   link.href = link.href.replace('http://', 'https://');
// }
// const links = document.querySelectorAll(".links");
// links.forEach(item => {
//     item instanceof HTMLElement && changeStyle(item);
// });
// function changeStyle(item: HTMLElement) {
//     item.style.fontSize = '2rem';
// }
// function verificarSeEMaior<T>(a: T, b: T): boolean {
//     if (a > b) return true;
//     else return false;
// }
// verificarSeEMaior(4, 5);
// function something<T>(arg: T): T {
//     return arg;
// }
// function newData<T>(arg: T) {
//     const data = {
//         dado: arg,
//         type: typeof arg
//     }
//     return data;
// }
// console.log(newData("Diego"));
async function fetchData() {
    const request = await fetch('https://api.origamid.dev/json/transacoes.json');
    const data = await request.json();
    console.log(data);
}
fetchData();
