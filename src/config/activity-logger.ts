import { UserInstance } from "src/modules/user/user.dto";
import logger from "./logger";


const type = 'ActivityLog';

interface ResourceDetails {
  id: number;
}

function getUserLogFormat(user: UserInstance) {
  return {
    id: user.id,
    email: user.email,
  };
}

function activityMessageFormat(
  user: UserInstance,
  resourceName: string,
  action: string,
): string {
  return `${user.email}  ${action} ${resourceName} successfully`;
}

function log<T extends ResourceDetails>(
  user: UserInstance,
  resource: T,
  resourceName: string,
  action: string,
) {
  const activityMessage = activityMessageFormat(user, resourceName, action);
  logger.info(
    { type, currentUser: getUserLogFormat(user), [resourceName]: resource },
    activityMessage,
  );
}

const activityLogger = {
  log,
};

export default activityLogger;
