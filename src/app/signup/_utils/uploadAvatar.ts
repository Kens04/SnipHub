import { createAvatar } from "@dicebear/core";
import { identicon } from "@dicebear/collection";

export const getNoAvatar = createAvatar(identicon, {
  seed: "Flizx",
  radius: 50,
  rowColor: ["00acc1", "1e88e5", "5e35b1"],
});
