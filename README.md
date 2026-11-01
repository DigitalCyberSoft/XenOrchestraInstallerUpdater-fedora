# Xen Orchestra Installer / Updater

### About this fork

This is a fork of [ronivay/XenOrchestraInstallerUpdater](https://github.com/ronivay/XenOrchestraInstallerUpdater) that adds Fedora support and a few changes to how Xen Orchestra is built and presented. Upstream changes are ported into it regularly, so everything below this section still applies. The build badges, the Docker image and the ready-made VM image (`xo-vm-import.sh`) are upstream's, though, and don't include anything listed here.

To use it, clone this repository instead of upstream's:
```
git clone https://github.com/DigitalCyberSoft/XenOrchestraInstallerUpdater-fedora.git
```

**What's different, and why**

* **Fedora 41 and newer, including Rawhide.** Upstream supports Debian, Ubuntu and the RHEL family, but not Fedora.
  * node.js and yarn come from Fedora's own `nodejs` and `yarnpkg` packages, and an update also updates node.js with dnf. Upstream uses NodeSource and the Yarn repository, which don't target Fedora. Xen Orchestra sometimes requires a newer node.js than Fedora ships. If that happens, the build stops with yarn's "engine node is incompatible" error, and upgrading Fedora is the fix.
  * Valkey is used instead of Redis, which Fedora replaced with Valkey in Fedora 41.
  * EPEL isn't used, and `libvhdi-tools` comes from the `reversejames/libvhdi` COPR.
* **Admin credentials.** At the end of an install, the script offers to replace the default `admin@admin.net` / `admin` login with your own email and password, either typed or generated. The menu also has a **Manage admin credentials** option to create or delete admins and change passwords. A fresh install shouldn't sit on a well-known password.
* **Uninstall.** The menu has an **Uninstall** option that removes the Xen Orchestra builds, services and configuration. Upstream has none.
* **Readable build output.** The build shows its progress, such as yarn's phases and turbo's task counts, and the elapsed time. When a step fails, it prints the error lines instead of only pointing to the log. Upstream is silent for several minutes, and failures meant digging through the log. Git clones are shallow and retried, for unreliable connections.
* **Self-upgrade from this fork.** With `SELFUPGRADE=true`, the script updates itself from this repository. That also happens when `xo-web-custom/` changes, since the customizations below are built from it. Upstream's self-upgrade only recognises its own repository.
* **Xen Orchestra 5 (v5) customizations.** They're applied to the sources just before the build, and each has an option in `xo-install.cfg`. If a Xen Orchestra update changes the code one of them relies on, that customization is skipped with a warning and the build carries on.
  * **Light / dark / auto theme.** v5 has no dark mode of its own. The dark theme in `xo-web-custom/` is built as a second stylesheet, and a **Theme** entry at the bottom of the menu switches between auto (follows the operating system), light and dark. There's no rebuild, and each browser keeps its own choice. `XO_WEB_THEME="light"`, `"dark"` or `"auto"` sets the mode browsers start with.
  * `DEFAULT_WEB_UI="v5"` or `"v6"` picks the web UI that opens at the root of the address. Both stay available at `/v5` and `/v6`. Interactive runs ask for these two settings once and save the answers in `xo-install.cfg`.
  * `XO_WEB_ITEMS_PER_PAGE="500"` (the default) makes the home page lists show 500 VMs, hosts or pools per page instead of 20, and adds 500 to the page size menu. `XO_WEB_SHOW_ALL="true"` (the default) shows all VMs and hosts by default instead of only the running ones. Both suit infrastructures with more than a screenful of VMs that aren't all running.
  * `HIDE_SOURCE_NOTICES="true"` (the default) hides the "not bundled with any support nor updates" banner, the "No support" menu entry and the weekly disclaimer pop-up. They're noise on an install that was built from the sources on purpose. It also hides the XOA menu entry (appliance updates, licences and support), which doesn't apply outside XOA.
  * `ENABLE_XOSTOR="true"` (the default) shows the XOSTOR pages, for hyperconverged storage on LINSTOR/DRBD. When creating or removing an XOSTOR, it skips the XOA licence steps.
    * XOSTOR is open source: LINSTOR and DRBD, XCP-ng's LinstorSR driver and Xen Orchestra's own XOSTOR code. Vates sells support for it.
    * Built from the sources, Xen Orchestra still shows "XOSTOR is available in XOA" instead of the XOSTOR pages. Creating an XOSTOR also calls XOA's licence service, which isn't part of the sources.

Like any Xen Orchestra built from the sources, none of this is supported by Vates.

[![](https://img.shields.io/endpoint?url=https://xo-build-status.yawn.fi/builds/debian/status.json)](https://xo-build-status.yawn.fi/builds/debian/details.html) [![](https://img.shields.io/endpoint?url=https://xo-build-status.yawn.fi/builds/centos/status.json)](https://xo-build-status.yawn.fi/builds/centos/details.html) [![](https://img.shields.io/endpoint?url=https://xo-build-status.yawn.fi/builds/ubuntu/status.json)](https://xo-build-status.yawn.fi/builds/ubuntu/details.html) [![](https://img.shields.io/endpoint?url=https://xo-build-status.yawn.fi/builds/almalinux/status.json)](https://xo-build-status.yawn.fi/builds/almalinux/details.html)

[![](https://img.shields.io/endpoint?url=https://xo-image.yawn.fi/downloads/status.json)](https://xo-image.yawn.fi/downloads/image.txt)

[![](https://github.com/ronivay/XenOrchestraInstallerUpdater/actions/workflows/main.yml/badge.svg)](https://github.com/ronivay/XenOrchestraInstallerUpdater/actions?query=workflow%3Axo-install) [![](https://github.com/ronivay/XenOrchestraInstallerUpdater/actions/workflows/lint.yml/badge.svg)](https://github.com/ronivay/XenOrchestraInstallerUpdater/actions?query=workflow%3Alint)

Script to install/update [Xen Orchestra](https://xen-orchestra.com/#!/) and all of it's dependencies on multiple different Linux distributions. Separate script to be used on XenServer/XCP-ng host that installs a readymade VM image that has Xen Orchestra installed  utilizing the same installer script.

How about docker? No worries, check [Docker hub](https://hub.docker.com/r/ronivay/xen-orchestra)

### What is Xen Orchestra?

Xen Orchestra is a web interface used to manage XenServer/XCP-ng hosts and pools. It runs separately and one can manage multiple different virtualization environments from one single management interface.

Xen Orchestra is developed by company called [Vates](https://vates.fr/). They offer Xen Orchestra as a turnkey appliance with different pricing models for different needs and even a free version with limited capabilities. This is the preferred and only supported method of using Xen Orchestra product as the appliance goes through QA and each of the plans come with support. I highly recommend using the official appliance if you plan on using Xen Orchestra in production environment, to support a great product and it's development now, and in the future.


### Why to use this script?

If you're a home user/enthusiast with simple environment you want to manage but can't justify the cost of Xen Orchestra appliance and don't need the support for it.

Since Xen Orchestra is open source and majority of the paid features included in the official appliance are part of the sources, one can build it themself. This [procedure](https://docs.xen-orchestra.com/installation#from-the-sources) is even documented. Note that even though this method is documented, it's not supported way of using Xen Orchestra and is intended to be used only for testing purposes and not in production.

This script offers an easy way to install all dependencies, fetch source code, compile it and do all the little details for you which you'd have to do manually otherwise. Other than that, it follows the steps described in the official documentation. All source code for Xen Orchestra is by default pulled from the official [repository](https://github.com/vatesfr/xen-orchestra).

**This script is not supported or endorsed by Xen Orchestra. Any issue you may have, please report it first to this repository.**

The very first version of this script i did purely for myself. Now i'm mainly trying to keep it up to date for others who might already rely on it frequently. My intentions are to offer an easy way for people to get into Xen Orchestra without restricted features which could potentially help this piece of software to evolve and grow.


### Preparations

First thing you need is a VM (or even a physical machine if you wish) where to install the software. This should have at least 4GB of RAM and ~1GB of free disk space. Having more CPU does speed a the build procedure a bit but isn't really a requirement. 2vCPU's on most systems are more than fine.

Supported Linux distributions and versions:

- CentOS 10 Stream
- CentOS 9 Stream
- AlmaLinux 10
- AlmaLinux 9
- AlmaLinux 8
- Rocky Linux 10
- Rocky Linux 9
- Rocky Linux 8
- Debian 13
- Debian 12
- Debian 11
- Ubuntu 26.04
- Ubuntu 24.04
- Ubuntu 22.04

NOTE: By default, libvhdi-tools is not installed on RHEL based distros; so file-level restores from delta backups within XO will not work.  However, users MAY install libvhdi-tools via a small, third-party maintained by a user of XenOrchestraInstallerUpdater specifically for XenOrchestraInstallerUpdater in order to re-enable file-level restore. To do so, set the INSTALL_EL_LIBVHDI variable to "true" in xo-install.cfg.  See: https://github.com/ronivay/XenOrchestraInstallerUpdater/pull/274

Only x86_64 architecture is supported. For all those raspberry pi users out there, check [container](https://hub.docker.com/r/ronivay/xen-orchestra) instead.

All OS/Architecture checks can be disabled in `xo-install.cfg` for experimental purposes. Not recommended obviously.

I suggest using a fresh OS installation, let script install all necessary dependencies and dedicate the VM for running Xen Orchestra.

If you plan on using the prebuilt VM image for XenServer/XCP-ng, see the image section below.

### Installation

Start by cloning this repository to the machine you wish to install to.

See [Wiki](https://github.com/ronivay/XenOrchestraInstallerUpdater/wiki) for common configuration options

There is a file called `sample.xo-install.cfg` which you should copy as `xo-install.cfg`. This file holds some editable configuration settings you might want to change depending on your needs.

When done editing configuration, just run the script with root privileges:
```
sudo ./xo-install.sh
```

There are few options you can choose from:

* `Install`

install all dependencies, necessary configuration and xen orchestra itself
* `Update`

update existing installation to the newest version available
* `Rollback`

should be self explanatory. if you wish to rollback to another installation after doing update or whatever

* `Install proxy`

install all dependencies, necessary configuration and xen orchestra backup proxy

* `Update proxy`

update existing proxy installation to newest version available


Each of these options can be run non interactively like so:

```
sudo ./xo-install.sh --install [--proxy]
sudo ./xo-install.sh --update [--proxy] [--force]
sudo ./xo-install.sh --rollback
```

As mentioned before, Xen Orchestra has some external dependencies from different operating system packages. All listed below will be installed if missing:

```
rpm:
- curl
- epel-release
- nodejs (v14)
- npm (v3)
- yarn
- gcc
- gcc+
- make
- openssl-devel
- redis (valkey if os version >=10)
- libpng-devel
- python3
- git
- nfs-utils
- libvhdi-tools
- cifs-utils
- lvm2
- ntfs-3g
- dmidecode
- sudo (if set in xo-install.cfg)
- patch

deb:
- apt-transport-https
- ca-certificates
- libcap2-bin
- curl
- yarn
- nodejs (v14)
- npm (v3)
- build-essential
- redis-server
- libpng-dev
- git
- python3-minimal
- libvhdi-utils
- lvm2
- nfs-common
- cifs-utils
- gnupg (debian 10/11/12/13)
- software-properties-common (ubuntu)
- ntfs-3g
- dmidecode
- sudo (if set in xo-install.cfg)
- patch
- libfuse2t64 (debian 13)
```

Following repositories will be installed if needed and repository install is enabled in xo-install.cfg

```
rpm:
- forensics repository
- epel repository
- nodesource repository
- yarn repository

deb:
- universe repository (ubuntu)
- nodesource repository
- yarn repository
```


#### Backup proxy

**Proxy installation method is experimental, use at your own risk. Proxy installation from sources is not documented by Xen Orchestra team. Method used here is the outcome of trial and error.**

**Proxy source code will be edited slightly to disable license check which only works with official XOA and there is no documented or working procedure to bypass it properly (there used to be but not anymore)**

Backup proxy can be used to offload backup tasks from the main Xen Orchestra instance to a proxy which has a direct connection to remote where backups are stored.

Requirements for proxy VM are otherwise the same as mentioned above, in addition proxy needs to be able to connect your XCP-ng/XenServer host and Xen Orchestra server needs to be able to access proxy via configured port. By default, it is expected that proxy VM lives inside your XO managed XCP-ng/XenServer pool and XO will figure out the proper connection address with proxy VM's uuid and will use port 443 by default. If you've installed your proxy outside of XCP-ng/XenServer pool and/or you're using some other port, you need to edit the proxy server address from Proxies menu after importing the configuration.

Majority of xo-install.cfg variables have no effect to proxy installation.

Since there is no way in Xen Orchestra from sources to register a proxy via UI, the installation will output a piece of json after the proxy is installed. You need to copy this json string and save to a file. Then use the config import option in Xen Orchestra settings to import this piece of json to add proxy. This works as a partial config import and won't overwrite any existing config. Although it's good to take a config export backup just in case.

Note that for obvious reasons some of the proxy features seen in Xen Orchestra UI aren't working, like upgrade button, upgrade check, redeploy, update appliance settings.

#### Plugins

Plugins are installed according to what is specified in `PLUGINS` variable inside `xo-install.cfg` configuration file. By default all available plugins that are part of xen orchestra repository are installed. This list can be narrowed down if needed and 3rd party plugins included.

### Image

If you don't want to first install a VM and then use `xo-install.sh` script on it, you have the possibility to import VM image which has everything already setup. Use `xo-vm-import.sh` to do this, it'll download a prebuilt Debian 13 image which has Xen Orchestra and XenOrchestraInstallerUpdater installed.

Details of image build process [here](https://github.com/ronivay/xen-orchestra-vm)

Run on your Xenserver/XCP-ng host with root privileges:

```
sudo bash -c "$(curl -s https://raw.githubusercontent.com/ronivay/XenOrchestraInstallerUpdater/master/xo-vm-import.sh)"
```

Default username for UI is `admin@admin.net` with password `admin`

SSH is accessible with username `xo` with password `xopass`

Remember to change both passwords before putting the VM to actual use.

Xen Orchestra is installed to /opt/xo, it uses self-signed certificates from /opt/ssl which you can replace if you wish. Installation script is at /opt/XenOrchestraInstallerUpdater which you can use to update existing installation in the future.

xo-server runs as a systemd service.

xo user has full sudo access. Xen Orchestra updates etc should be ran with sudo.

This image is updated weekly. Latest build date and MD5/SHA256 checksum can be checked from [here](https://xo-image.yawn.fi/downloads/image.txt)

Built and tested on XCP-ng 8.x

### Tests and VM image

I run my own little implementation of automation consisting of ansible and virtual machines to test the installation on a regular basis with different operating systems. Test results are visible in badges on top of this readme.

VM image is also built from scratch by me and distributed from an object storage.


### Contributing

Pull requests and issues (either real issues or just suggestions) are more than welcome. Note that i do not wish to make any modifications to Xen Orchestra source code as part of this script.

### Support

If you find this project useful and want to support the development by covering some of the hosting costs that come from maintaining an XCP-ng server in a data center, use paypal donation link below.

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/donate/?business=LCX7UV7LUGNY6&no_recurring=0&currency_code=EUR)
