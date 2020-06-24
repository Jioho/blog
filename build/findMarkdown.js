// findMarkdown.js
const fs = require('fs')

function findMarkdown(dir, callback) {
  console.log(dir)
  fs.readdir(dir, function(err, files) {
    console.log(err, '??')
    if (err) throw err
    files.forEach(fileName => {
      let innerDir = `${dir}/${fileName}`
      if (fileName.indexOf('.') !== 0) {
        fs.stat(innerDir, function(err, stat) {
          if (stat.isDirectory()) {
            findMarkdown(innerDir, callback)
          } else {
            // 跳过readme 文件，当然你也可以自行修改
            if (/\.md$/.test(fileName) && !/README/.test(fileName)) callback(innerDir)
          }
        })
      }
    })
  })
}

module.exports = findMarkdown
