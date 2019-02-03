// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const electron = require('electron');
const ipc = electron.ipcRenderer;
var Pb = require('progressbar.js');
var os = require('os');
var pb = require('progressbar.js');
var fun = window.setInterval(mem, 1000);
var tmemory = os.totalmem() / Math.pow(1024, 3);
var tmem = tmemory.toFixed(1) / 100;
var rtext = document.getElementById('text');
var si = require('systeminformation');
const ipcR = require('electron').ipcRenderer;

var exit = document.getElementById('close');
exit.addEventListener('click',function(){
  console.log("exit");
  ipcR.send('close-clicked','exit');
});

var diskinfo = null;
si.cpu(function(data) {
  var cpu_m = document.getElementById('cpus');
  var cpu_pc = document.getElementById('cpu_physical_cores');
  var cpu_c = document.getElementById('cpu_cores');
  var cpu_s = document.getElementById('cpu_speed');
  var cpu_skt = document.getElementById('cpu_socket');
  cpu_m.innerHTML = data.manufacturer + " " + data.brand;
  cpu_pc.innerHTML = data.physicalCores;
  cpu_c.innerHTML = data.cores;
  cpu_s.innerHTML = data.speed + "GHz";
  cpu_skt.innerHTML = data.socket;
});

si.diskLayout(function(data) {
  for (var i = 0; i < data.length; i++) {
    var disk = data[i];
    var parent = document.getElementById('diskcontainer');
    var div = document.createElement('div');
    var size = document.createElement('div');
    var type = document.createElement('div');
    var smart = document.createElement('div');
    var heading = document.createElement('h3');

    var d_size = disk.size / Math.pow(1024, 3); //Conversion to GB

    heading.appendChild(document.createTextNode(disk.name));
    size.appendChild(document.createTextNode("Capacity: " + d_size.toFixed(2) + "GB"));
    type.appendChild(document.createTextNode("Type: " + disk.type));
    smart.appendChild(document.createTextNode("S.M.A.R.T: " + disk.smartStatus));

    div.className = "inline-block";
    div.appendChild(heading);
    div.appendChild(size);
    div.appendChild(type);
    div.appendChild(smart);

    parent.appendChild(div);
  }
});

si.graphics(function(data) {
  for (var i = 0; i < data.controllers.length; i++) {
    var gpu = data.controllers[i];
    var parent = document.getElementById('gpu_value');
    var div = document.createElement('div');

    var name = document.createElement('div');
    var bus = document.createElement('div');
    var vram = document.createElement('div');

    name.appendChild(document.createTextNode(gpu.model));
    bus.appendChild(document.createTextNode(gpu.bus));
    vram.appendChild(document.createTextNode(gpu.vram * 2 + "MB"));

    div.appendChild(name);
    div.appendChild(bus);
    div.appendChild(vram);

    parent.appendChild(div);
  }
});

si.currentLoad(function(data) {

});

si.blockDevices(function(data) {
  diskinfo = data;
  if (diskinfo != null) {
    fs();
  }
});

function fs() {
  si.fsSize(function(data) {
    console.log(data);
    console.log("diskinfo");
    console.log(diskinfo);
    for (var i = 0; i < data.length; i++) {
      var drive = data[i];
      var info = diskinfo[i];
      var size = drive.size / Math.pow(1024, 3);
      var use_p = parseFloat(drive.use).toFixed(0);
      var filesystem = drive.type;
      var isRemovable = info.removable;
      var name = info.label;

      var parent = document.getElementById('disk0');
      var div = document.createElement('div');
      div.className = "inline-block";
      div.appendChild(document.createTextNode(use_p + "%"));
      parent.appendChild(div);

      var barline = new pb.Line(disk0, {
        strokeWidth: 4,
        easing: 'easeInOut',
        duration: 1400,
        color: '#aaa',
        trailColor: '#eee',
        trailWidth: 2,
        svgStyle: {
          width: '100%',
          height: '100%'
        },
        from: {
          color: '#CDDC39',
          width: 2
        },
        to: {
          color: '#F44336',
          width: 4
        },
        step: (state, bar) => {
          bar.path.setAttribute('stroke', state.color);
          //bar.setText(Math.round(bar.value() * 100) + ' %');
        }
      });
      barline.animate(use_p / 100); // Number from 0.0 to 1.0


    }
  });
}

function mem() {
  var fmemory = os.freemem() / Math.pow(1024, 3);
  var umemory = parseFloat(tmemory) - parseFloat(fmemory);
  var umem = umemory.toFixed(1) / 100;
  var per = umem / tmem;
  bar.animate(per.toFixed(2));
  rtext.innerHTML = "RAM: " + umemory.toFixed(1) + "/" + tmem * 100 + "GB";
}


var bar = new Pb.Circle(ram, {
  color: '#aaa',
  // This has to be the same size as the maximum width to
  // prevent clipping
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  text: {
    autoStyleContainer: false,
    value: ''
  },
  from: {
    color: '#CDDC39',
    width: 2
  },
  to: {
    color: '#F44336',
    width: 4
  },
  // Set default step function for all animate calls
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText('');
    } else {
      circle.setText(value + "%");
    }

  }
});
bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
bar.text.style.fontSize = '2rem';

const gpuInfo = require('gpu-info');
gpuInfo().then(function(data) {
    console.log('GPUS:', data);
});
