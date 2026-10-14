import React, { ChangeEvent, FormEvent, useState } from "react";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import { useGlobals } from "../../hooks/useGlobals";
import { MemberUpdateInput } from "../../../lib/types/member";
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";
import { Messages } from "../../../lib/config";
import MemberService from "../../services/MemberService";
import { imageUrl } from "../../../lib/format";

const VALID_IMAGE_TYPES = ["image/jpg", "image/jpeg", "image/png"];

export function Settings() {
  const { authMember, setAuthMember } = useGlobals();
  const [preview, setPreview] = useState<string>(imageUrl(authMember?.memberImage));
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [memberUpdateInput, setMemberUpdateInput] = useState<MemberUpdateInput>({
    memberNick: authMember?.memberNick ?? "",
    memberPhone: authMember?.memberPhone ?? "",
    memberAddress: authMember?.memberAddress ?? "",
    memberDesc: authMember?.memberDesc ?? "",
    memberImage: authMember?.memberImage,
  });

  /** Handler */
  const changeHandler = (field: keyof MemberUpdateInput) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setMemberUpdateInput((prev) => ({ ...prev, [field]: e.target.value }));

  const handleImageViewer = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      sweetErrorHandling(Messages.error5).then();
      e.target.value = "";
      return;
    }
    setMemberUpdateInput((prev) => ({ ...prev, memberImage: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmitHandle = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!authMember) throw new Error(Messages.error2);
      if (!memberUpdateInput.memberNick?.trim() || !memberUpdateInput.memberPhone?.trim()) {
        throw new Error("Username and phone are required!");
      }
      setSubmitting(true);
      const result = await new MemberService().updateMember(memberUpdateInput);
      setAuthMember(result);
      sweetTopSmallSuccessAlert("Profile updated", 1500);
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card settings" onSubmit={handleSubmitHandle}>
      <div className="settings-head">
        <h2>Profile details</h2>
        <p>This information is used for your orders and deliveries.</p>
      </div>

      <div className="avatar-field">
        <img src={preview} alt="" onError={(e) => ((e.target as HTMLImageElement).src = "/icons/default-user.svg")} />
        <div>
          <label className="btn btn-ghost btn-sm">
            <PhotoCameraOutlinedIcon fontSize="small" /> Change photo
            <input type="file" hidden accept="image/jpeg,image/jpg,image/png" onChange={handleImageViewer} />
          </label>
          <p>JPG or PNG, up to 5MB.</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="field">
          <label htmlFor="mb-nick">Username</label>
          <input id="mb-nick" className="input" type="text" value={memberUpdateInput.memberNick} onChange={changeHandler("memberNick")} />
        </div>
        <div className="field">
          <label htmlFor="mb-phone">Phone</label>
          <input id="mb-phone" className="input" type="tel" value={memberUpdateInput.memberPhone} onChange={changeHandler("memberPhone")} />
        </div>
        <div className="field span-2">
          <label htmlFor="mb-address">Delivery address</label>
          <input
            id="mb-address"
            className="input"
            type="text"
            placeholder="Street, house, district"
            value={memberUpdateInput.memberAddress}
            onChange={changeHandler("memberAddress")}
          />
        </div>
        <div className="field span-2">
          <label htmlFor="mb-desc">About you</label>
          <textarea
            id="mb-desc"
            className="input"
            placeholder="Your usual order, favourite table, anything we should know…"
            value={memberUpdateInput.memberDesc}
            onChange={changeHandler("memberDesc")}
          />
        </div>
      </div>

      <div className="settings-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
