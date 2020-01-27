import fs from "fs";
import path from "path";
import superagent from "superagent";
import LeeAnalyzer from "./dellAnalyzer";

export interface Analyzer {
  analyze: (html: string, filePath: string) => string;
}

class Crowller {
  //抓取路径
  private filePath = path.resolve(__dirname, "../data/course.json");

  //private analyzer 相当于 this.analyzer = analyzer public也是同样的意思
  constructor(private url: string, private analyzer: Analyzer) {
    // this.analyzer = analyzer;
    this.initSpiderProcess();
  }

  async getRawHtml() {
    const result = await superagent.get(this.url);
    return result.text;
  }

  writeFile(content: string) {
    fs.writeFileSync(this.filePath, content);
  }

  async initSpiderProcess() {
    //先抓取HTML
    const html = await this.getRawHtml();
    //处理业务逻辑
    const fileContent = this.analyzer.analyze(html, this.filePath);
    //写文件
    this.writeFile(fileContent);
  }
}

const secret = "secretKey";
const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;

const analyzer = LeeAnalyzer.getInstance();

new Crowller(url, analyzer);
