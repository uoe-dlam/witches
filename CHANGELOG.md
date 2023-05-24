# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Semantic Versioning 2.0.0

## [Unreleased]

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
- Allows user to filter across multiple filter properties at the same time, and the filters are shared across pages (PR #49 & #50)
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