import fs from "fs";
import cheerio from "cheerio";
import { Analyzer } from "./crowller";

interface Course {
  title: string;
  count: number;
}

interface CourseResult {
  time: number;
  data: Course[];
}

interface Content {
  [propName: number]: Course[];
}

export default class DellAnalyzer implements Analyzer {
  //单利模式
  private static instance: DellAnalyzer;
  static getInstance() {
    if (!DellAnalyzer.instance) {
      DellAnalyzer.instance = new DellAnalyzer();
    }
    return DellAnalyzer.instance;
  }
  private constructor() {}

  //cheerio 类似于JQ 能获取指定DOM的元素
  private getCourseInfo(html: string) {
    const $ = cheerio.load(html);
    const courseItems = $(".course-item");
    const courseInfos: Course[] = [];
    courseItems.map((index, element) => {
      const descs = $(element).find(".course-desc");
      const title = descs.eq(0).text();
      const count = parseInt(
        descs
          .eq(1)
          .text()
          .split("：")[1],
        10
      );
      courseInfos.push({ title, count });
    });
    return {
      time: new Date().getTime(),
      data: courseInfos
    };
  }
  //生成JSON
  generateJsonContent(courseInfo: CourseResult, filePath: string) {
    let fileContent: Content = {};
    if (fs.existsSync(filePath)) {
      //Content接口规定是了对象格式所以要转
      fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    //如果有新的 写入
    fileContent[courseInfo.time] = courseInfo.data;
    return fileContent;
  }

  public analyze(html: string, filePath: string) {
    const courseInfo = this.getCourseInfo(html);
    const fileContent = this.generateJsonContent(courseInfo, filePath);
    return JSON.stringify(fileContent);
  }
}
