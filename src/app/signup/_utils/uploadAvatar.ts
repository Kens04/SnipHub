import { createAvatar } from "@dicebear/core";
import { identicon } from "@dicebear/collection";
import { v4 as uuidv4 } from "uuid";

export const getNoAvatar = createAvatar(identicon, {
  seed: `${uuidv4()}`,
  radius: 50,
  rowColor: ["00acc1", "1e88e5", "5e35b1"],
});
