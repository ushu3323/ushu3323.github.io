const messages = {
  LOADING: 'Cargando...',
  error: {
    CURRICULUM_FETCH_ERROR: 'No se pudo cargar la informacion del curriculum',
    CURRICULUM_BAD_FORMAT_ERROR: 'El formato del curriculum no es valido'
  }
};
const LOCALHOST_CVINFO_KEY = 'cv';
const CURRICULUM_DATA_URL = 'data.json';

function resolveNationality(nationality) {
  const displayNames = new Intl.DisplayNames('es', { type: 'region' })
  return displayNames.of(nationality);
}

class CurriculumVitae {
  static fromAPIJSON(json) {
    let cv = new CurriculumVitae();
    cv.nombre = json.name.first;
    cv.apellido = json.name.last;
    if (json.gender === 'male') {
      cv.genero = 'Masculino';
    } else if (gender === 'female') {
      cv.genero = 'Femenino';
    }
    cv.fecha_nacimiento = new Date(json.dob.date).toLocaleDateString('es', { dateStyle: 'short' });
    cv.nacionalidad = resolveNationality(json.nat);
    cv.ciudad = `${json.location.city} ${json.location.state}`;
    cv.direccion = `${json.location.street.name} ${json.location.street.number}`;
    cv.numero_telefono = json.cell;
    cv.numero_hogar = json.phone;
    cv.email = json.email;
    cv.url_foto = json.picture;
    return cv;
  }

  static validate(o) {
    for (const key of ['nombre', 'apellido', 'genero', 'fecha_nacimiento', 'nacionalidad', 'ciudad', 'direccion', 'numero_telefono', 'numero_hogar', 'email', 'url_foto']) {
      if (!o[key] || typeof o[key] !== 'string') {
        throw new TypeError(messages.error.CURRICULUM_BAD_FORMAT_ERROR);
      }
    }
    return o;
  }
  constructor(nombre, apellido, genero, fecha_nacimiento, nacionalidad, ciudad, direccion, numero_telefono, numero_hogar, email, url_foto) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.genero = genero;
    this.fecha_nacimiento = fecha_nacimiento;
    this.nacionalidad = nacionalidad;
    this.ciudad = ciudad;
    this.direccion = direccion;
    this.numero_telefono = numero_telefono;
    this.numero_hogar = numero_hogar;
    this.email = email;
    this.url_foto = url_foto;
  }
}

async function getRemoteJSON() {
  try {
    let res = await fetch(CURRICULUM_DATA_URL);
    let json = await res.json();
    console.log("cv from remote file", json);
    return json
  } catch (err) {
    console.error(messages.error.CURRICULUM_FETCH_ERROR);
    throw err;
  }
}

async function getCurriculumVitae() {
  let cv;
  try {
    json = await getRemoteJSON();
    cv = CurriculumVitae.fromAPIJSON(json)
  } catch (err) {
    console.error(err)
    throw err;
  }
  return cv;
}

let exposedCollapseElementList = null;
function enableBSCollapse() {
  const collapseElementList = document.querySelectorAll('.graph-article');
  const collapseList = [];
  for (let i = 0; i < collapseElementList.length; i++) {
    const parent = collapseElementList[i];
    const collapseElement = parent.querySelector('.graph-article--content-accordion');
    const nodeBtn = parent.querySelector('.node');
    const collapse = new bootstrap.Collapse(collapseElement, { toggle: false });
    nodeBtn.onclick = () => {
      console.log(collapse.toggle());
    }
    collapseElement.addEventListener('hide.bs.collapse', () => nodeBtn.classList.remove('active'))
    collapseElement.addEventListener('show.bs.collapse', () => nodeBtn.classList.add('active'))
    collapseList.push(collapse);
  }
  exposedCollapseElementList = collapseList;
}

function loadInfo(cv) {
  document.getElementById('foto-perfil').setAttribute('src', cv.url_foto);

  document.getElementById('title').setAttribute('data-text', `${cv.nombre} ${cv.apellido}`);
  document.getElementById('genero').innerText = cv.genero;
  document.getElementById('fecha-nacimiento').innerText = cv.fecha_nacimiento;
  document.getElementById('nacionalidad').innerText = cv.nacionalidad;
  document.getElementById('ciudad').innerText = cv.ciudad;
  document.getElementById('direccion').innerText = cv.direccion;
  document.getElementById('numero-telefono').innerText = cv.numero_telefono;
  document.getElementById('email').innerText = cv.email;
}

function setToDefaults() {
  document.getElementById('nombre').innerText = messages.LOADING;
  document.getElementById('apellido').innerText = messages.LOADING;
  document.getElementById('genero').innerText = messages.LOADING;
  document.getElementById('fecha-nacimiento').innerText = messages.LOADING;
  document.getElementById('nacionalidad').innerText = messages.LOADING;
  document.getElementById('ciudad').innerText = messages.LOADING;
  document.getElementById('direccion').innerText = messages.LOADING;
  document.getElementById('numero-telefono').innerText = messages.LOADING;
  document.getElementById('email').innerText = messages.LOADING;
  document.body.classList.remove('loaded');
}

async function main() {
  const cv = await getCurriculumVitae();
  loadInfo(cv);
  document.body.classList.add('loaded');
}

main().then(() => {
  startWriteAnimations();
});
enableBSCollapse();