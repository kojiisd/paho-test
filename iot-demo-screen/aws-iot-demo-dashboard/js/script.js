var topic = "aws-iot-demo/demo"

var body = {
    "label_id": "id",
    "id": [],
};
// Data arrays for showing.
var dataArrays = [
    {
        "pos_x": 550,
        "pos_y": -700,
        "group": "A",
        "id": "A-001"
    },
    {
        "pos_x": 300,
        "pos_y": 800,
        "group": "A",
        "id": "A-002"
    },
    {
        "pos_x": 2000,
        "pos_y": 400,
        "group": "A",
        "id": "A-003"
    },
    {
        "pos_x": 1000,
        "pos_y": 1800,
        "group": "A",
        "id": "A-004"
    }
];

var dataIdArray = [];
for (let idx in dataArrays) {
    dataIdArray.push(dataArrays[idx]['id']);
}
console.log(dataIdArray);

var bg_image_url = "../images/MyanmarMap.png"


var camera, scene, scene_map, renderer, renderer_map;
var controls;

var objects = [];
var targets = { table: []/* , sphere: [], helix: [], grid: []  */ };
camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.z = 8000;

scene = new THREE.Scene();
scene_map = new THREE.Scene();
renderer = new THREE.CSS3DRenderer();
renderer_map = new THREE.WebGLRenderer({ alpha:true });

$(document).ready(function () {

    // map initialization
    initMap();
    init(dataArrays);
    animate();

    function initMap() {
        var loader = new THREE.TextureLoader();
        loader.setCrossOrigin('Anonymous');
        loader.crossOrigin = 'Anonymous';
        var texture = loader.load(bg_image_url, function(texture) {renderer_map.render(scene_map, camera)});
        // var texture = new THREE.TextureLoader().load('MyanmarMap.png', function(texture) {renderer_map.render(scene_map, camera)});
        var material = new THREE.MeshBasicMaterial({ map: texture });

        var geometry = new THREE.PlaneGeometry(7000, 7000);
        var object = new THREE.Mesh( geometry, material );

        scene_map.add(object);
        scene_map.backgroundColor = new THREE.Color( 0xFFFFFF );
        
        renderer_map.setSize(window.innerWidth, window.innerHeight);
        renderer_map.domElement.style.position = 'absolute';
        renderer_map.setClearColor( 0xFFFFFF, 1 );
        renderer_map.domElement.style.zIndex = "0"; 
        document.getElementById('container').appendChild(renderer_map.domElement);
        
        renderer_map.render(scene_map, camera);
        
    }

    function init(table) {
        for (var i = 0; i < table.length; i++) {
            // body update
            body.id.push(table[i].id);

            var element = document.createElement('div');
            element.className = 'element';
            element.id = table[i].id;
            // element.style.backgroundColor = 'rgba(0,127,127,0.75)';


            var idElement = document.createElement( 'div' );
            idElement.className = 'number';
            idElement.textContent = table[i].id;
            element.appendChild(idElement);

            var symbol = document.createElement('div');
            symbol.className = 'symbol';
            symbol.id = table[i].id + '_symbol';
            symbol.textContent = 0; // initial value
            element.appendChild(symbol);

            var object = new THREE.CSS3DObject(element);
            object.position.x = Math.random() * 4000 - 2000;
            object.position.y = Math.random() * 4000 - 2000;
            object.position.z = Math.random() * 4000 - 2000;
            scene.add(object);

            objects.push(object);

            var object = new THREE.Object3D();
            object.position.x = (table[i].pos_x - 1000);
            object.position.y = - (table[i].pos_y - 1000);

            targets.table.push(object);
        }


        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.position = 'absolute';
        document.getElementById('container').appendChild(renderer.domElement);


        controls = new THREE.TrackballControls(camera, renderer.domElement);
        controls.rotateSpeed = 0.5;
        controls.minDistance = 500;
        controls.maxDistance = 10000;
        controls.noRotate = false;
        controls.addEventListener('change', render);

        var button = document.getElementById('table');
        button.addEventListener('click', function (event) {

            transform(targets.table, 2000);

        }, false);


        transform(targets.table, 2000);

        window.addEventListener('resize', onWindowResize, false);
        renderer.render(scene, camera);
        
    }

    function transform(targets, duration) {

        TWEEN.removeAll();

        for (var i = 0; i < objects.length; i++) {

            var object = objects[i];
            var target = targets[i];

            new TWEEN.Tween(object.position)
                .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();

            new TWEEN.Tween(object.rotation)
                .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();

        }

        new TWEEN.Tween(this)
            .to({}, duration * 2)
            .onUpdate(render)
            .start();

    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer_map.setSize(window.innerWidth, window.innerHeight);

        render();

    }

    function animate() {

        requestAnimationFrame(animate);

        TWEEN.update();

        controls.update();

    }

    function render() {

        renderer.render(scene, camera);
        renderer_map.render(scene_map, camera);

    }
});