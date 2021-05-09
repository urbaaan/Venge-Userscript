/* global pc, BloomEffect, SepiaEffect, HueSaturationEffect, EdgeDetectEffect, BrightnessContrastEffect*/

const settings = {
		'BLOOM_INTENSITY': {
			defaultValue: 0,
			type: 'slider',
			text: 'Bloom Intensity',
			max: 200,
			min: 0
		},
		'SEPIA_AMOUNT': {
			defaultValue: 0,
			type: 'slider',
			text: 'Sepia Amount',
			max: 100,
			min: 0,
		},
		'MONOTONE': {
			defaultValue: false,
			type: 'checkbox',
			text: 'Monotone'
		},
		'DARK': {
			defaultValue: false,
			type: 'checkbox',
			text: 'Dark Effect'
		},
		'CONTRAST': {
			defaultValue: true,
			type: 'checkbox',
			text: 'Color Contrast'
		}

	},
	version = '1.0.2'

fetch('https://raw.githubusercontent.com/urbaaan/uClient/main/mods/version.json')
	.then((json) => json.json())
	.then((data) => {
		if (data.version !== version) {
			confirm('Latest Version is Out! Would you like to Download?')
				.then(() => {
					window.open()
				})	
		}
	})

let graphics = (window.settings) ? new window.settings() : new window.Settings() //Changing Naming Scheme soon
graphics.createSettings('Graphics')

Object.keys(settings).forEach((key) => {
	if (!localStorage.getItem(key)) localStorage.setItem(key, settings[key].defaultValue)
	graphics.addSettings(Object.assign({ name: key } , settings[key]))
})

let scripts = {
	'bloom': 'https://cdn.jsdelivr.net/gh/playcanvas/engine@master/scripts/posteffects/posteffect-bloom.js',
	'sepia': 'https://cdn.jsdelivr.net/gh/playcanvas/engine@master/scripts/posteffects/posteffect-sepia.js',
	'huesaturation': 'https://cdn.jsdelivr.net/gh/playcanvas/engine@master/scripts/posteffects/posteffect-huesaturation.js',
	'edgedetect': 'https://cdn.jsdelivr.net/gh/playcanvas/engine@master/scripts/posteffects/posteffect-edgedetect.js',
	'contrast': 'https://cdn.jsdelivr.net/gh/playcanvas/engine@master/scripts/posteffects/posteffect-brightnesscontrast.js'
}

Object.values(scripts).forEach((script) => {
	pc.app.assets.loadFromUrl(script, 'script', (err) => {
		if (err) alert(err)
	})
})

pc.app.on('Map:Loaded', () => {
	let camera = pc.app.getEntityFromIndex('68d4e7a4-7063-11ea-97ae-026349a27a7c'),
		effect = [ new BloomEffect(pc.app.graphicsDevice), new SepiaEffect(pc.app.graphicsDevice), new HueSaturationEffect(pc.app.graphicsDevice), new EdgeDetectEffect(pc.app.graphicsDevice), new BrightnessContrastEffect(pc.app.graphicsDevice) ]

	effect[0].bloomIntensity = parseInt(localStorage.getItem('BLOOM_INTENSITY')) / 100
	effect[1].amount = parseInt(localStorage.getItem('SEPIA_AMOUNT')) / 100
	effect[2].saturation = (localStorage.getItem('MONOTONE') === 'true') ? -1 : 0
	if (localStorage.getItem('DARK') === 'true') {
		effect[3] = new EdgeDetectEffect(pc.app.graphicsDevice)
		effect[3].intensity = 2
	}
	else {
		effect[3] = new BloomEffect(pc.app.graphicsDevice)
		effect[3].bloomIntensity = 0
	}
	effect[4].contrast = (localStorage.getItem('CONTRAST') === 'true') ? 0.3 : 0
	loop()
	function loop() {
		window.requestAnimationFrame(() => {
			effect.forEach((effects) => {
				camera.camera.postEffects.removeEffect(effects)
			})
			effect.forEach((effects) => {
				camera.camera.postEffects.addEffect(effects)
			})
			loop()
		})
	}
})





