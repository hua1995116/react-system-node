const express = require('express');
const axios = require('axios');
const app = express();
const { exec } = require('child_process');

var router = express.Router();

router.get('/',function(req,res,next){
	req.url = './index.html';
	next();
});

app.use(router);


// app.get('/', function(req, res) {
// 	axios.get('https://api.github.com/repos/hua1995116/webchat/branches/master', {
// 		"headers": {
// 			"Authorization": "token 38b90976c2fe8ef462e2018a73c2ce290696162a",
// 			"Content-Type": "charset=UTF-8"
// 		}
// 	}).then((data) => {
// 		// res.setHeader('content-type', 'text/html;charset=UTF-8');
// 		// res.write(JSON.stringify(parseJson(data.data)));
// 		res.json({
// 			data: data.data
// 		})
// 	})
// });

app.get('/api/repos', function(req, res) {
	axios.get('https://api.github.com/users/hua1995116/repos', {
		"headers": {
			"Authorization": "token 38b90976c2fe8ef462e2018a73c2ce290696162a",
			"Content-Type": "charset=UTF-8"
		}
	}).then((data) => {
		// res.setHeader('content-type', 'text/html;charset=UTF-8');
		// res.write(JSON.stringify(parseJson(data.data)));
		res.json({
			data: parseJson(data.data)
		})
	})
});


app.get('/api/branches', function(req, res) {
	const name = req.query.name;
	axios.get(`https://api.github.com/repos/hua1995116/${name}/branches`, {
		"headers": {
			"Authorization": "token 38b90976c2fe8ef462e2018a73c2ce290696162a",
			"Content-Type": "charset=UTF-8"
		}
	}).then((data) => {
		// res.setHeader('content-type', 'text/html;charset=UTF-8');
		// res.write(JSON.stringify(parseJson(data.data)));
		res.json({
			data: parseJson(data.data)
		})
	})
})

app.get('/api/build', function(req, res) {
	const name = req.query.name;
	const branch = req.query.branch;
	console.log(name, branch);
	axios.get(`https://api.github.com/repos/hua1995116/${name}/branches/${branch}`, {
		"headers": {
			"Authorization": "token 38b90976c2fe8ef462e2018a73c2ce290696162a",
			"Content-Type": "charset=UTF-8"
		}
	}).then((data) => {
		// res.setHeader('content-type', 'text/html;charset=UTF-8');
		// res.write(JSON.stringify(parseJson(data.data)));
		// console.log(data.data._links.html);
		const sha = data.data.commit.sha;
		const url = `https://github.com/hua1995116/${name}.git`;
		const child = exec(`publish.sh ${sha} ${url} ${name}`,  (error, stdout, stderr) => {
			if (error) {
				res.json({
					code: 100
				})
			} else {
				res.json({
					code: 200
				})
			}
			
		});
		
	})
})

function parseJson(data) {
	const arr = [];
	for(let i in data) {
		arr.push({
			name: data[i]['name'],
			description: data[i]['description'],
			language: data[i]['language'],
			stargazers_count: data[i]['stargazers_count'],
			forks: data[i]['forks'],
		})
	}
	arr.sort((a, b) => {
		return b.stargazers_count - a.stargazers_count;
	})
	return arr;
}

app.use(express.static('./build'));

const server = app.listen(8080);