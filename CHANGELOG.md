# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Semantic Versioning 2.0.0

## [Unreleased]

### Changed

- Upgrade Nuxt from version 3 to version 4 which is the latest version available (PR# 184)

### Fixed

- Fixed broken images on the site. These were not loading correctly due to a change in the image path expected by Nuxt 4 (PR #190)

## [1.5.0] - 2026-06-22

### Added

- Added user guide video to the resources page (PR #180)
- Added a different visual for the devil in scotland which is compatible with mobile devices (PR #179)
- Added github link to the resources page (PR #178)
- Enabled Nuxt bridge for use on the project (PR 124)
- Added descriptions for filters (PR #112)
- Added embedded Microsoft form to the contact page (PR #83)
- Added histropedia info to the pop up box (PR #75)
- Added scroll event styling to the site layout (PR #74)

### Fixed

- Fixed a spelling mistake which was preventing some memorials details from being loaded (PR #177)
- Made user interface changes to improve user experience (PR #176, PR #175, 174)
- Fixed an issue with the icon colours on mobile view (PR #116)
- Fixed an incorrect number that was being displayed for the number of located witches (PR #115)
- Removed unnecessary html elements that were part of the page Map filters component (PR #100)
- Updated user interface elements to improve user experience across the site (PR #98, PR #97, PR #95, PR #94, PR #93)
- Embeds linked to Isobel Young's story map, flourish and histropedia have been fixed (PR #89)
- Captioning on the historical map has been fixed (PR #87)
- Navbar has been fixed to account to differences between test and live server (PR #85)

### Changed

- Upgraded Nuxt to version 3 (PR #173)
- Map icons have been moved around for better user experience (PR #113)
- Updated the about page to add in more information regarding what the site is for (PR #108)
- Queries used in the site are now specific to ensure that only the required data is retrieved (PR #92)
- Filter lists are now in alphabetical order, with Unknown being the first value (PR #90)
- Updated the user interface elements to improve user experience (PR #81, PR #80, PR #79, PR #78)
- Historic maps have been updated to improve clarity and readability (PR #77)

## 2023-07-01

### Fixed

- Make sure timelines actually show witches when changed (PR #60)
- Reword some menu items (PR #58)
- Fix cookie banner (PR #58)
- Make sure arrow images show on test and live server (use full path to images) (PR #56)
- Instead of using static json file for consuming data (see PR #53), call php backend to get up-to-date data (PR #55)

### Added

- Add change log (PR #72)
- Add select and de-select all checkboxes to filters (PR #71)
- Cache json file retrieved from backend (PR #61)
- Add histropedia visualisation (PR #57)
- Restructure menu (PR #57)
- Move api calls to json file which is consumed locally (instead of making api calls) (PR #53)
- Add additional pages: Case Characterisations and Shapeshifting & Ritual Objects (PR #53)
- Add cookie banner (PR #53)
- Add timeline to maps (PR #52)
- Allows user to filter across multiple filter properties at the same time, and the filters are shared across pages (PR
  #49 & #50)
- Refactor site to use filter and map components (PR #48)
- Allow users to turn clusters on/off (PR #48)

## [1.4.0] - 2021-06-23

### Fixed

- Fix historic map issue - needed to update url of map tiles (PR #47)

## [1.3.0] - 2022-06-16

### Fixed

- Updated json packages (PR #45)
- Make sure witch icon is correct size after leaflet package upgrade (PR #45)

## [1.2.0] - 2022-06-15

### Fixed

- Made sure link to blog works (PR #44)

## [1.1.0] - 2021-09-27

### Added

- Added licence (PR #37)
- Added css classes to organise code (PR #37)

### Fixed

- Updated readme (PR #37)
- Updated json packages (PR #37)

[unreleased]: https://github.com/uoe-dlam/witches/compare/v1.5.0...HEAD

[1.5.0]: https://github.com/uoe-dlam/witches/releases/tag/v1.5.0