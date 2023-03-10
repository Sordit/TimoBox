import AppDataSource from "../config/database";
import { Activity, Command, NfcTag } from "../models";
import { ActivityType } from "../models/activity";

interface GetActivityResponse {
  activity: Activity[]
}

interface AddActivityResponse {
  success: boolean
}

export default class ActivityController {

  public async getActivityList(): Promise<GetActivityResponse> {
    console.log("getActivityList");
    const activityList: Activity[] = await AppDataSource.manager
      .getRepository(Activity)
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.command', 'command')
      .leftJoinAndSelect('activity.tag', 'tag')
      .orderBy('activity.createdAt', 'DESC')
      .getMany();

    return {
      activity: activityList
    };
  }

  public async addActivity(message: string, type: ActivityType): Promise<AddActivityResponse> {
    console.log("addActivityCommand");

    let activity = new Activity();
    activity.message = message;
    activity.type = type;

    activity = await AppDataSource.manager.save(activity);
    return {
      success: activity.id ? true : false
    };
  }

  public async addActivityCommand(command: Command, type: ActivityType): Promise<AddActivityResponse> {
    console.log("addActivityCommand");

    let activity = new Activity();
    activity.type = type;
    activity.message = '';
    activity.command = command;

    activity = await AppDataSource.manager.save(activity);
    return {
      success: activity.id ? true : false
    };
  }

  public async addActivityTag(tag: NfcTag, type: ActivityType): Promise<AddActivityResponse> {
    console.log("addActivityTag");

    let activity = new Activity();
    activity.type = type;
    activity.message = '';
    activity.tag = tag;

    activity = await AppDataSource.manager.save(activity);
    return {
      success: activity.id ? true : false
    };
  }

}