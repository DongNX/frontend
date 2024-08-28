import "@material/mwc-button/mwc-button";
import { css, CSSResultGroup, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators";
import { fireEvent } from "../../../../common/dom/fire_event";
import "../../../../components/ha-alert";
import { createCloseHeading } from "../../../../components/ha-dialog";
import { HassDialog } from "../../../../dialogs/make-dialog-manager";
import { haStyleDialog } from "../../../../resources/styles";
import { HomeAssistant } from "../../../../types";
import { JoinBetaDialogParams } from "./show-dialog-join-beta";

@customElement("dialog-join-beta")
export class DialogJoinBeta
  extends LitElement
  implements HassDialog<JoinBetaDialogParams>
{
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _dialogParams?: JoinBetaDialogParams;

  public showDialog(dialogParams: JoinBetaDialogParams): void {
    this._dialogParams = dialogParams;
  }

  public closeDialog(): void {
    this._dialogParams = undefined;
    fireEvent(this, "dialog-closed", { dialog: this.localName });
  }

  protected render() {
    if (!this._dialogParams) {
      return nothing;
    }

    return html`
      <ha-dialog
        open
        @closed=${this.closeDialog}
        .heading=${createCloseHeading(
      this.hass,
      this.hass.localize("ui.dialogs.join_beta_channel.title")
    )}
      >
        <ha-alert alert-type="warning">
          ${this.hass.localize("ui.dialogs.join_beta_channel.backup")}
        </ha-alert>
        <p>
          ${this.hass.localize("ui.dialogs.join_beta_channel.warning")}
          ${this.hass.localize("ui.dialogs.join_beta_channel.release_items")}
        </p>
        <ul>
          <li>Digo Core</li>
          <li>Digo Supervisor</li>
          <li>Digo Operating System</li>
        </ul>

        <mwc-button slot="primaryAction" @click=${this._cancel}>
          ${this.hass.localize("ui.common.cancel")}
        </mwc-button>
        <mwc-button slot="primaryAction" @click=${this._join}>
          ${this.hass.localize("ui.dialogs.join_beta_channel.join")}
        </mwc-button>
      </ha-dialog>
    `;
  }

  private _cancel() {
    this._dialogParams?.cancel?.();
    this.closeDialog();
  }

  private _join() {
    this._dialogParams?.join?.();
    this.closeDialog();
  }

  static get styles(): CSSResultGroup {
    return [
      haStyleDialog,
      css`
        a {
          text-decoration: none;
        }
        a ha-svg-icon {
          --mdc-icon-size: 16px;
        }
      `,
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dialog-join-beta": DialogJoinBeta;
  }
}
