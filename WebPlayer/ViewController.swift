//
//  ViewController.swift
//  WebPlayer
//
//  Created by admin on 22.03.2021.
//

import Cocoa
import SafariServices.SFSafariApplication
import SafariServices.SFSafariExtensionManager

let appName = "WebPlayer"
let extensionBundleIdentifier = "com.easysystem.webplayer.extension"

class ViewController: NSViewController, NSWindowDelegate {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.view.wantsLayer = true
    }
    
    override func viewDidAppear() {
        self.view.window?.delegate = self
        self.view.window?.styleMask = [NSWindow.StyleMask.closable, NSWindow.StyleMask.titled, NSWindow.StyleMask.miniaturizable]
    }
    
    func windowShouldClose(_ sender: NSWindow) -> Bool {
        NSApplication.shared.terminate(self)
        return true
    }
    
    @IBAction func openSafariExtensionPreferences(_ sender: AnyObject?) {
        SFSafariApplication.showPreferencesForExtension(withIdentifier: extensionBundleIdentifier) { error in
            guard error == nil else {
                // Insert code to inform the user that something went wrong.
                return
            }

            DispatchQueue.main.async {
                NSApplication.shared.terminate(nil)
            }
        }
    }

}
