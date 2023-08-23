Q: The simulation environment has the following asset configuration:

1.  asset_name: "microwave", asset_type: "articulate",
    part_cofiguration:
        Part 1: "door"
            - link_name: "link_0"
            - joint_name: "joint_0"
            - joint_type: "revolute"
            - joint_lower_limit: 0
            - joint_upper_limit: 1
        Part 2: "handle"
            - link_name: "handle_0"
            - joint_name: "handlejoint_0"
            - joint_type: "fixed"

Available APIs from simulator are:
1. get_position_by_asset_link_name(asset_name, link_name) # returns the x, y, z position of the link
2. get_robot_gripper_position(asset_name, link_name) # returns the x, y, z position of the gripper
3. get_state_by_asset_joint_name(asset_name, joint_name) # returns the state of the link
4. get_joint_limits(asset_name) # returns the lower, upper limit of the joint

What is the reward function, success condition to perform task OpenMicrowaveDoor?

A:
Task: OpenMicrowaveDoor
```
def compute_reward(self):
    # reward function
    door_handle_pose = self.env.get_position_by_asset_link_name("microwave", "handle_0")
    gripper_pose = self.env.get_robot_gripper_position()
    distance_gripper_to_handle = torch.norm(door_handle_pose - gripper_pose, dim=-1)
    door_state = self.env.get_state_by_asset_joint_name("microwave", "joint_0")
    cost = distance_gripper_to_handle - door_state
    reward = - cost

    # success condition
    target_door_state = self.env.get_joint_upper_limit("microwave", "joint_0")
    success = torch.abs(door_state - target_door_state) < 0.1

    return reward, success
```

Q: What is the reward function, success condition to perform task Pick up Apple?