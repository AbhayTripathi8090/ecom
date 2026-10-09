import { Router } from "express";

import {
  getNotificationsController,
  getUnreadCountController,
  markNotificationAsReadController,
  markAllNotificationsAsReadController,
} from "./notification.controller";

import { authenticate, authorize } from "../auth/auth.middleware";
import { validate } from "../../middleware/validate";
import {
  notificationParamsSchema,
  notificationQuerySchema,
} from "./notification.validation";

const router = Router();

router.use(authenticate, authorize("admin"));

router.get("/", validate(notificationQuerySchema, "query"), getNotificationsController);

router.get("/unread-count", getUnreadCountController);

router.patch("/read-all", markAllNotificationsAsReadController);

router.patch(
  "/:id/read",
  validate(notificationParamsSchema, "params"),
  markNotificationAsReadController,
);

export default router;