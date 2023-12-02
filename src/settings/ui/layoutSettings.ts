import { EditorView } from "@codemirror/view";
import { App, Modal, Setting, TextAreaComponent } from "obsidian";
import { DEFAULT_LAYOUT_SETTINGS } from "src/main";
import { editorFromTextArea } from "src/util/util";
import type { LayoutSettings } from "types/layout";

export class LayoutSettingsModal extends Modal {

    settings: LayoutSettings = {
        defaultSavesModifier: 'Error',
        defaultTableModifier: 'Error'
    };

    editor: EditorView;
    saved: boolean;
    constructor(app: App, settings: LayoutSettings) {
        super(app);

        this.settings = { ...DEFAULT_LAYOUT_SETTINGS, ...settings };
    }

    onOpen() {
        this.titleEl.setText("Layout Settings");
        this.display();
    }

    buttonsEl = createDiv("block-buttons-container");

    async display() {
        this.contentEl.empty();

        this.containerEl.addClass("statblock-block-editor");

        this.buildSettings(this.contentEl);

        this.buildButtons(this.buttonsEl);
        this.contentEl.appendChild(this.buttonsEl);
    }

    buildSettings(el: HTMLElement) {
        new Setting(el)
            .setHeading()
            .setName("Default Saves Modifier Calculation")
            .setDesc(
                createFragment((e) => {
                    e.createSpan({
                        text: "Allows a default custom modifier for the Save block."
                    });
                    e.createEl("br");
                    e.createSpan({ text: "Variable " });
                    e.createEl("code", { text: "value" });
                    e.createSpan({
                        text: "is accessible, use this to calculate the modifier."
                    });
                })
            );
        const saveComponent = new TextAreaComponent(el).setValue(
            this.settings.defaultSavesModifier
        );
        saveComponent.inputEl.addClasses([
            "statblock-textarea",
            "statblock-textarea-small"
        ]);
        this.editor = editorFromTextArea(
            saveComponent.inputEl,
            EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                    this.settings.defaultSavesModifier = update.state.doc.toString();
                }
            })
        );

        new Setting(el)
            .setHeading()
            .setName("Default Table Modifier Calculation")
            .setDesc(
                createFragment((e) => {
                    e.createSpan({
                        text: "Allows a default custom modifier for the Table block."
                    });
                    e.createEl("br");
                    e.createSpan({ text: "Variable " });
                    e.createEl("code", { text: "value" });
                    e.createSpan({
                        text: "is accessible, use this to calculate the modifier."
                    });
                })
            );
        const tableComponent = new TextAreaComponent(el).setValue(
            this.settings.defaultTableModifier
        );
        tableComponent.inputEl.addClasses([
            "statblock-textarea",
            "statblock-textarea-small"
        ]);
        this.editor = editorFromTextArea(
            tableComponent.inputEl,
            EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                    this.settings.defaultTableModifier = update.state.doc.toString();
                }
            })
        );
    }

    buildButtons(el: HTMLDivElement) {
        console.log('builed !', el)
        el.empty();
        new Setting(el)
            .addButton((b) =>
                b
                    .setCta()
                    .setIcon("checkmark")
                    .setTooltip("Save")
                    .onClick(() => {
                        this.saved = true;
                        this.close();
                    })
            )
            .addExtraButton((b) =>
                b
                    .setIcon("cross")
                    .setTooltip("Cancel")
                    .onClick(() => {
                        this.close();
                    })
            );
        console.log('builed end', el)

    }
}