---
title: "Unit 4: Network Functionality and Topologies"
subjectId: "computer-science"
courseId: "ecs-1"
unitId: "unit-4"
---

## Unit Summary: Network Functionality and Topologies

**Network functionality is achieved through the interaction of various components:** networking devices, network topologies, and routing technologies. These components work together to enable communication and data transfer between devices on a network.

**Networking devices act as tools that facilitate communication and data sharing between computers and other devices on a network.** Some key networking devices include:

-   **Hubs**, which connect multiple devices and broadcast data to all connected devices.
-   **Switches**, which are similar to hubs but can filter data packets, sending them directly to the intended recipient for better performance.
-   **Routers**, which direct data between networks, including connecting devices to the Internet.
-   **Access Points**, which allow wireless devices to join wired networks.
-   **Modems**, which connect local networks to the Internet.
-   **Firewalls**, which protect networks by blocking unauthorized access.

**Network topology describes how devices are connected in a network.** It is essentially a map illustrating the pathways of data flow. Each type of network topology has its advantages and disadvantages:

-   **Bus Topology:** All devices connect to a single main cable, minimizing cable usage and cost, but a break in the cable can disrupt the entire network.
-   **Ring Topology:** Devices are connected in a circle, and data travels in a single direction. Adding devices or cable breaks can disrupt the network, but dual rings can provide backup.
-   **Star Topology:** All devices connect to a central device (hub or switch). It is easy to manage and add devices, but failure of the central device disrupts the network.
-   **Mesh Topology:** Every device connects to every other device, providing high redundancy but making the network complex to manage.
-   **Hybrid Topology:** Combines two or more network types for customized solutions balancing cost and performance, but design and maintenance become more complex.

**Routing determines the path data packets take through the network to reach their destination.** This can be achieved through static or dynamic routing:

-   **Static routing** involves manually configuring fixed paths for data by a network administrator. It is simple to implement but inflexible to network changes.
-   **Dynamic routing** allows routes to adjust automatically based on network conditions. It is more adaptable but requires more complex setup.

Several **routing protocols** manage how routers communicate and share information to determine the best path for data. Key protocols include:

-   **RIP**, which is suitable for small networks and uses hop counts to determine the shortest route.
-   **OSPF**, which uses an algorithm to calculate the fastest path and is designed for large networks.
-   **EIGRP**, which balances speed and management ease, making it ideal for private networks.
-   **BGP**, which directs data between different networks globally, forming the core protocol of the Internet.
