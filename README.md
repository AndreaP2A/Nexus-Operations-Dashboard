<p align="center">
  <img src="public/favicon.png" alt="Nexus Operations Logo" width="120" />
</p>

# Nexus Operations — Distributed Systems Monitor
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white)](https://tanstack.com/query/latest)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

A high-density operational dashboard designed for monitoring distributed microservices. Built to demonstrate advanced frontend data handling capabilities including complex filtering, aggregation, and error resilience without relying on heavy UI libraries.

> **⚠️ Frontend Architecture Showcase**: This project focuses on advanced UI/UX patterns and client-side logic. While it currently utilizes a sophisticated mock API layer to simulate real-world network conditions (latency, errors), the architecture is production-ready and designed to integrate seamlessly with real REST/GraphQL endpoints.

### 🌐 Live Demo
[**View the Logic & Performance Showcase**](https://andreap2a.github.io/Nexus-Operations-Dashboard/)

---

### ✨ Highlights
- **Metric Aggregation**: Real-time calculation of system health, active regions, and uptime percentages on the client side.
- **Resilient Data Layer**: Implemented with React Query to handle loading skeletons, stale data, and automatic retries.
- **Advanced Filtering**: Context-aware filtering where dashboard cards act as controls for the data table.
- **Optimistic UI**: Immediate feedback interactions with "breathing" status indicators and seamless view transitions.
- **Zero-UI-Library**: All components (Tables, Pagination, Cards) built from scratch to demonstrate core CSS/React mastery.

### 🚀 Tech Stack
- **Core**: React 19 + Vite 7
- **Logic**: TypeScript
- **State**: TanStack Query (React Query)
- **Styling**: Native CSS Variables (Glassmorphism theme)
- **Icons**: Lucide React

### 🍱 Architecture & Features

#### 📊 Mission Control Dashboard
- **Total Systems**: Aggregate count of all monitored endpoints.
- **System Health**: "Heartbeat" monitor that pulses when issues are detected.
- **Global Coverage**: Active region counter.
- **Uptime Tracker**: Average reliability metric across the mesh.

#### 🗃️ Operational Data Grid
- **ServiceTable**: Custom implementation of a dense data grid.
  - Multi-column Sorting (Asc/Desc).
  - Client-side Pagination with adjustable page size.
  - Multi-parameter filtering (Name, Region, Status).
- **RegionTable**: Aggregated view logic transforming flat service lists into regional summaries with visual health bars.

#### ⚡ Data Simulation
- **Mock API**: Simulates network latency (300-800ms) and random failure rates.
- **Error Recovery**: Specific UI flows for handling 500/Network errors with user-initiated retry mechanisms.

### 📡 Design Principles
1.  **Information Density**: Maximum data visibility with minimal whitespace waste.
2.  **State Visibility**: User always knows if data is loading, stale, or erroring.
3.  **Visual Hierarchy**: Critical issues (Offline/Degraded) use high-contrast semantic colors (Red/Amber).
4.  **Glassmorphism**: Modern aesthetic using backdrop-filters to layer content depth.

### ️ Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/AndreaP2A/Nexus-Operations-Dashboard.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

### 📄 License
This project is open-source and available under the [MIT License](LICENSE).

---
<p align="center" style="font-size: 0.8em; opacity: 0.7;">
  <i>👾 <b>Fun Fact:</b> I chose "Nexus" for this project because I'm a big fan of <b>Heroes of the Storm</b>... those who know, know! <br/>See you in the Nexus!</i>
</p>
